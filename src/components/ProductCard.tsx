import React, { useRef } from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { Product } from '../types';
import Button from './Button';

interface ProductCardProps {
    product: Product;
    isAdding: boolean;
    onAddClick: (product: Product, imageRect: DOMRect) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAdding, onAddClick }) => {
    const imageRef = useRef<HTMLImageElement>(null);

    const handleClick = () => {
        const imageRect = imageRef.current?.getBoundingClientRect();
        if (imageRect) {
            onAddClick(product, imageRect);
        }
    };

    const isPasta = product.categoryId === 'pastas-clasicas' || product.categoryId === 'pastas-especiales';

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                <img
                    ref={imageRef}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand-dark font-bold text-sm shadow-sm">
                    ${product.price.toFixed(2)}
                </div>
            </div>
            <div className="p-5 flex flex-col h-[180px]">
                <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                <Button
                    onClick={handleClick}
                    fullWidth
                    variant="outline"
                    className={isAdding ? 'bg-brand-orange !text-white' : ''}
                >
                    {isAdding ? (
                        <span className="flex items-center gap-2">Agregado <CheckCircle size={16} /></span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {isPasta ? 'Personalizar' : 'Agregar'}
                            <Plus size={16} />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
};
