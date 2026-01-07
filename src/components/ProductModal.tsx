import React, { useState } from 'react';
import { Extra, Product } from '../types';

import { CheckCircle, Utensils, X } from 'lucide-react';
import { EXTRA_PROTEINS, EXTRA_TOPPINGS } from '../constants';
import Button from './Button';

// Customization Modal
interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product, extras: Extra[], e: React.MouseEvent) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
    const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

    const toggleExtra = (extra: Extra) => {
        setSelectedExtras(prev => {
            const exists = prev.find(e => e.id === extra.id);
            if (exists) {
                return prev.filter(e => e.id !== extra.id);
            }
            return [...prev, extra];
        });
    };

    const totalPrice = product.price + selectedExtras.reduce((sum, e) => sum + e.price, 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
                onClick={onClose}
                role="button"
                tabIndex={0}
                aria-label="Cerrar modal"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onClose();
                    }
                }}
            ></div>
            <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">

                {/* Header Image */}
                <div className="relative h-48 flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-2xl font-serif font-bold text-white">{product.name}</h3>
                        <p className="text-white/90 text-sm">{product.description}</p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto overflow-x-hidden">

                    {/* Proteins */}
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Utensils size={18} className="text-brand-orange" /> Extra Proteína
                        </h4>
                        <div className="space-y-2">
                            {EXTRA_PROTEINS.map(extra => (
                                <label key={extra.id} className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-brand-orange rounded focus:ring-brand-orange border-gray-300"
                                            checked={selectedExtras.some(e => e.id === extra.id)}
                                            onChange={() => toggleExtra(extra)}
                                        />
                                        <span className="text-gray-700 font-medium">{extra.name}</span>
                                    </div>
                                    <span className="text-brand-orange font-bold">+${extra.price.toFixed(2)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Toppings */}
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-3">Extra Toppings</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {EXTRA_TOPPINGS.map(extra => (
                                <label key={extra.id} className={`
                  flex flex-col p-3 border rounded-xl cursor-pointer transition-all
                  ${selectedExtras.some(e => e.id === extra.id) ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}
                `}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-gray-700 leading-tight">{extra.name}</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedExtras.some(e => e.id === extra.id)}
                                            onChange={() => toggleExtra(extra)}
                                        />
                                        {selectedExtras.some(e => e.id === extra.id) && <CheckCircle size={16} className="text-brand-orange" />}
                                    </div>
                                    <span className="text-xs text-gray-500">+${extra.price.toFixed(2)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    <Button
                        onClick={(e) => onAddToCart(product, selectedExtras, e)}
                        fullWidth
                        className="flex justify-between items-center group"
                    >
                        <span>Agregar al Pedido</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};