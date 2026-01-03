import React, { useMemo } from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { CartItem, Product, ViewState } from '../types';
import Button from '../components/Button';

interface Props {
    cart: CartItem[];
    setView: (view: ViewState) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    handleAddToCartClick: (product: Product, e: React.MouseEvent) => void;
    cartTotal: number;
}

export const Cart: React.FC<Props> = ({
    cart,
    setView,
    updateQuantity,
    removeFromCart,
    handleAddToCartClick,
    cartTotal
}) => {
    // Suggestions Logic: Not in cart, prioritized categories (bebidas, postres)
    const suggestions = useMemo(() => {
        const inCartIds = new Set(cart.map(i => i.id));
        const candidates = PRODUCTS.filter(p => !inCartIds.has(p.id));

        const priority = candidates.filter(p => ['bebidas', 'postres'].includes(p.categoryId));
        const others = candidates.filter(p => !['bebidas', 'postres'].includes(p.categoryId));

        // Combine: up to 3 priority items, fill with others if needed
        return [...priority, ...others].slice(0, 3);
    }, [cart]);

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                    <ShoppingCart size={48} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">¡Nuestras pastas te están esperando!</p>
                <Button onClick={() => setView('menu')}>Ir al Menú</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8">Tu Pedido</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Item List */}
                <div className="flex-1">
                    <div className="space-y-4 mb-8">
                        {cart.map(item => {
                            const itemBasePrice = item.price;
                            const extrasTotal = item.selectedExtras?.reduce((sum, e) => sum + e.price, 0) || 0;
                            const itemTotal = itemBasePrice + extrasTotal;

                            return (
                                <div key={item.cartItemId} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 animate-fade-in-up items-start z-10 group/item">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-brand-dark truncate pr-2">{item.name}</h3>

                                            {/* Price with Tooltip */}
                                            <div className="relative group flex flex-col items-end">
                                                <p className="text-brand-orange font-bold whitespace-nowrap cursor-help border-b border-dashed border-brand-orange/30">
                                                    ${itemTotal.toFixed(2)}
                                                </p>

                                                {/* Breakdown Tooltip */}
                                                <div className="absolute bottom-full right-0 mb-2 w-64 bg-brand-dark text-white text-xs rounded-xl p-3 shadow-xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-gray-300">
                                                            <span>Base ({item.name})</span>
                                                            <span>${itemBasePrice.toFixed(2)}</span>
                                                        </div>
                                                        {item.selectedExtras?.map((extra, idx) => (
                                                            <div key={`${extra.id}-${idx}`} className="flex justify-between text-gray-400">
                                                                <span>+ {extra.name}</span>
                                                                <span>${extra.price.toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                        <div className="border-t border-gray-600 my-1 pt-1 flex justify-between font-bold text-white">
                                                            <span>Precio Unitario</span>
                                                            <span>${itemTotal.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    {/* Arrow */}
                                                    <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-brand-dark"></div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Display Extras */}
                                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                                            <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                                                {item.selectedExtras.map(extra => (
                                                    <div key={extra.id} className="flex justify-between gap-2">
                                                        <span>+ {extra.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.cartItemId, -1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-brand-orange"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartItemId, 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-brand-orange"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.cartItemId)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Suggestions Section */}
                    {suggestions.length > 0 && (
                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-serif font-bold text-xl text-brand-dark mb-4">También te podría interesar</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {suggestions.map(product => (
                                    <div key={product.id} className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col gap-3 group">
                                        <div className="relative h-24 rounded-lg overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{product.name}</h4>
                                            <p className="text-xs text-gray-500 mb-2">${product.price.toFixed(2)}</p>
                                            <Button
                                                onClick={(e) => handleAddToCartClick(product, e)}
                                                variant="outline"
                                                className="w-full !py-1.5 !px-2 text-xs"
                                            >
                                                <Plus size={14} /> Agregar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary & Action */}
                <div className="lg:w-80 h-fit sticky top-24 z-0">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="font-bold text-lg mb-4">Resumen</h3>
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Envío</span>
                            <span>$2.50</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex justify-between mb-6">
                            <span className="font-bold text-xl">Total</span>
                            <span className="font-bold text-xl text-brand-orange">${(cartTotal + 2.50).toFixed(2)}</span>
                        </div>
                        <Button onClick={() => setView('checkout')} fullWidth>
                            Continuar Compra
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};