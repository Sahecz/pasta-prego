
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CartItem, Product, Extra } from '../types';
import { FlyingItem } from '../components/FlyingImage';

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            return [];
        }
    });

    const [isAddingId, setIsAddingId] = useState<string | null>(null);
    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
    const cartBtnRef = useRef<HTMLButtonElement>(null);

    // Persist Cart
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Derived State
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const extrasCost = item.selectedExtras ? item.selectedExtras.reduce((sum, e) => sum + e.price, 0) : 0;
            return total + ((item.price + extrasCost) * item.quantity);
        }, 0);
    }, [cart]);

    const cartItemCount = useMemo(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    const addToCart = (product: Product, extras: Extra[], e?: React.MouseEvent) => {
        setIsAddingId(product.id);

        // Calculate a unique ID based on product + sorted extras
        const extrasId = extras.length > 0
            ? '-' + extras.map(e => e.id).sort().join('-')
            : '';
        const cartItemId = `${product.id}${extrasId}`;

        // Trigger Flying Animation
        if (e && cartBtnRef.current) {
            const targetBtn = e.currentTarget as HTMLElement;
            // Try to find image in modal first, then in card
            let img = targetBtn.closest('.group')?.querySelector('img') as HTMLImageElement; // Card image

            // If triggered from modal (no .group parent usually), try to find the modal image
            if (!img) {
                // Fallback logic for modal animation source
                const modalContent = targetBtn.closest('.fixed');
                if (modalContent) {
                    img = modalContent.querySelector('img') as HTMLImageElement;
                }
            }

            if (img) {
                const startRect = img.getBoundingClientRect();
                const targetRect = cartBtnRef.current.getBoundingClientRect();

                setFlyingItems(prev => [...prev, {
                    id: Date.now(),
                    src: product.image,
                    startRect,
                    targetRect
                }]);
            }
        }

        // Update Cart with delay to match animation landing
        setTimeout(() => {
            setCart(prev => {
                const existing = prev.find(item => item.cartItemId === cartItemId);
                if (existing) {
                    return prev.map(item =>
                        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...product, quantity: 1, selectedExtras: extras, cartItemId }];
            });
            setIsAddingId(null);
        }, 600);
    };

    const updateQuantity = (cartItemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartItemId === cartItemId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (cartItemId: string) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const removeFlyingItem = (id: number) => {
        setFlyingItems(prev => prev.filter(i => i.id !== id));
    }

    return {
        cart,
        cartTotal,
        cartItemCount,
        isAddingId,
        flyingItems,
        cartBtnRef,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        removeFlyingItem
    };
};
