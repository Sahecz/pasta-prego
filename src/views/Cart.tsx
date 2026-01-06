import React, { useMemo } from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import Button from '../components/Button';
import { useCartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface Props {
    handleAddToCartClick: (product: Product, e: React.MouseEvent) => void;
}

export const Cart: React.FC<Props> = ({
    handleAddToCartClick,
}) => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCartContext();
    const navigate = useNavigate();

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
                <Button onClick={() => navigate('/menu')}>Ir al Menú</Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-dark mb-6 md:mb-10">Tu Pedido</h2>

            {/* Grid Layout: 
                Mobile: 1 column (Order: Items, Summary, Suggestions) relies on Source Order.
                Desktop: 2 columns [1fr, 22rem]. Summary moves to col 2, row 1, span 2. Items col 1 row 1. Suggestions col 1 row 2.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-8 md:gap-10 items-start">

                {/* 1. Item List (Mobile: 1st, Desktop: Col 1 Row 1) */}
                <div className="space-y-4 md:space-y-5">
                    {cart.map(item => {
                        const itemBasePrice = item.price;
                        const extrasTotal = item.selectedExtras?.reduce((sum, e) => sum + e.price, 0) || 0;
                        const itemTotal = itemBasePrice + extrasTotal;

                        return (
                            <div key={item.cartItemId} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm flex gap-4 md:gap-6 animate-fade-in-up items-start z-10 group/item">
                                <img src={item.image} alt={item.name} className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover flex-shrink-0 shadow-md" />
                                <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[5rem] md:min-h-[7rem]">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg md:text-2xl text-brand-dark truncate pr-2 md:pr-4">{item.name}</h3>

                                            {/* Price with Tooltip */}
                                            <div className="relative group flex flex-col items-end">
                                                <p className="text-brand-orange text-lg md:text-2xl font-bold whitespace-nowrap cursor-help border-b-2 border-dashed border-brand-orange/30">
                                                    ${itemTotal.toFixed(2)}
                                                </p>

                                                <div className="absolute bottom-full right-0 mb-2 w-72 bg-brand-dark text-white text-sm rounded-xl p-4 shadow-xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none hidden md:block">
                                                    <div className="space-y-2">
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
                                                        <div className="border-t border-gray-600 my-2 pt-2 flex justify-between font-bold text-white text-base">
                                                            <span>Precio Unitario</span>
                                                            <span>${itemTotal.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full right-4 -mt-1 border-8 border-transparent border-t-brand-dark"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                                            <div className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500 space-y-0.5 md:space-y-1">
                                                {item.selectedExtras.map(extra => (
                                                    <div key={extra.id} className="flex justify-between gap-2">
                                                        <span>+ {extra.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-between mt-auto pt-2 md:pt-0">
                                        <div className="flex items-center gap-3 md:gap-4 bg-gray-50 rounded-xl p-1 md:p-1.5 border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-brand-orange transition-colors"
                                            >
                                                <Minus size={16} className="md:w-[18px] md:h-[18px]" />
                                            </button>
                                            <span className="font-bold w-6 md:w-8 text-center text-base md:text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-brand-orange transition-colors"
                                            >
                                                <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={20} className="md:w-6 md:h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 2. Summary & Action (Mobile: 2nd, Desktop: Col 2 Row 1 Spanning 2) */}
                <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 h-fit md:sticky md:top-24 z-0">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
                        <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6">Resumen</h3>
                        <div className="flex justify-between mb-2 md:mb-3 text-gray-600 text-base md:text-lg">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 md:mb-6 text-gray-600 text-base md:text-lg">
                            <span>Envío</span>
                            <span>$2.50</span>
                        </div>
                        <div className="border-t-2 border-gray-100 pt-4 md:pt-6 flex justify-between mb-6 md:mb-8">
                            <span className="font-bold text-xl md:text-2xl">Total</span>
                            <span className="font-bold text-2xl md:text-3xl text-brand-orange">${(cartTotal + 2.50).toFixed(2)}</span>
                        </div>
                        <Button fullWidth onClick={() => navigate('/checkout')} className="py-3 md:py-4 text-lg md:text-xl shadow-brand-orange/30 shadow-lg">
                            Continuar Compra
                        </Button>
                    </div>
                </div>

                {/* 3. Suggestions Section (Mobile: 3rd, Desktop: Col 1 Row 2) */}
                {suggestions.length > 0 && (
                    <div className="lg:col-start-1">
                        <div className="border-t border-gray-100 pt-6 md:pt-8 mt-2 md:mt-0">
                            <h3 className="font-serif font-bold text-xl md:text-2xl text-brand-dark mb-4 md:mb-6">También te podría interesar</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                {suggestions.map(product => (
                                    <div key={product.id} className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 md:gap-4 group hover:shadow-lg transition-all">
                                        <div className="relative h-24 md:h-32 rounded-xl overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-base md:text-lg text-gray-800 line-clamp-1 mb-1">{product.name}</h4>
                                            <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">${product.price.toFixed(2)}</p>
                                            <Button
                                                onClick={(e) => handleAddToCartClick(product, e)}
                                                variant="outline"
                                                className="w-full text-xs md:text-sm py-2"
                                            >
                                                <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Agregar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};