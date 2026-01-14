import React from 'react';
import { CATEGORIES, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';
import { Product } from '../types';
import { SEO } from '../components/SEO';

interface MenuProps {
    onAddToCartClick: (product: Product, imageRect: DOMRect) => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ onAddToCartClick, activeCategory, setActiveCategory }) => {
    const { isAddingId } = useCartContext();
    const filteredProducts = PRODUCTS.filter(p => p.categoryId === activeCategory);

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <SEO
                title="Pasta Prè-gō | Menú"
                description="Explora nuestra selección de pastas frescas, salsas caseras y especialidades italianas."
                image="/images/hero-pasta.webp"
            />
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
                        <ProductCard
                            key={product.id}
                            product={product}
                            isAdding={isAddingId === product.id}
                            onAddClick={onAddToCartClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
