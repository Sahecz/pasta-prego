import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import Button from './Button';

interface SuggestionCardProps {
    product: Product;
    onAddClick: (product: Product, imageRect: DOMRect) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ product, onAddClick }) => {
    const imageRef = useRef<HTMLImageElement>(null);

    const handleClick = () => {
        const imageRect = imageRef.current?.getBoundingClientRect();
        if (imageRect) {
            onAddClick(product, imageRect);
        }
    };

    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 md:gap-4 group hover:shadow-lg transition-all">
            <div className="relative h-24 md:h-32 rounded-xl overflow-hidden">
                <img
                    ref={imageRef}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-base md:text-lg text-gray-800 line-clamp-1 mb-1">{product.name}</h4>
                <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">${product.price.toFixed(2)}</p>
                <Button
                    onClick={handleClick}
                    variant="outline"
                    className="w-full text-xs md:text-sm py-2"
                >
                    <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Agregar
                </Button>
            </div>
        </div>
    );
};
