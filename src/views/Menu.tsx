import React from 'react'
import { CheckCircle, Plus } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../constants";

import Button from '../components/Button'
import { useCartContext } from '../context/CartContext';
import { Product } from "../types";

type Props = {
    onAddToCartClick: (product: Product, e: React.MouseEvent) => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

export const Menu = ({ onAddToCartClick, activeCategory, setActiveCategory }: Props) => {
    const { isAddingId } = useCartContext();
    const filteredProducts = PRODUCTS.filter(p => p.categoryId === activeCategory);

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Categories Sticky Header */}
            <div className="sticky top-[70px] z-30 bg-white shadow-sm pt-2 pb-0 overflow-x-auto no-scrollbar">
                <div className="flex px-4 min-w-max gap-4 pb-2 md:justify-center">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`
                px-5 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-200
                ${activeCategory === cat.id
                                    ? 'bg-brand-orange text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand-dark font-bold text-sm shadow-sm">
                                    ${product.price.toFixed(2)}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col h-[180px]">
                                <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                                <Button
                                    onClick={(e) => onAddToCartClick(product, e)}
                                    fullWidth
                                    variant="outline"
                                    className={`${isAddingId === product.id ? 'bg-brand-orange !text-white' : ''}`}
                                >
                                    {isAddingId === product.id ? (
                                        <span className="flex items-center gap-2">Agregado <CheckCircle size={16} /></span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {(product.categoryId === 'pastas-clasicas' || product.categoryId === 'pastas-especiales')
                                                ? 'Personalizar'
                                                : 'Agregar'}
                                            <Plus size={16} />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
