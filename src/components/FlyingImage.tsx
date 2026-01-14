import React, { useState, useEffect } from 'react';
import { FLYING_ANIMATION_DURATION_MS, FLYING_ANIMATION_EASING } from '../constants';

export interface FlyingItem {
    id: number;
    src: string;
    startRect: DOMRect;
    targetRect: DOMRect;
}

interface FlyingImageProps {
    item: FlyingItem;
    onComplete: () => void;
}

export const FlyingImage: React.FC<FlyingImageProps> = ({ item, onComplete }) => {
    const [style, setStyle] = useState<React.CSSProperties>({
        position: 'fixed',
        top: item.startRect.top,
        left: item.startRect.left,
        width: item.startRect.width,
        height: item.startRect.height,
        opacity: 1,
        zIndex: 9999,
        pointerEvents: 'none',
        transition: `all ${FLYING_ANIMATION_DURATION_MS}ms ${FLYING_ANIMATION_EASING}`,
        borderRadius: '1rem',
        objectFit: 'cover'
    });

    useEffect(() => {
        // Trigger animation in next frame
        requestAnimationFrame(() => {
            setStyle(prev => ({
                ...prev,
                top: item.targetRect.top + (item.targetRect.height / 2) - 10,
                left: item.targetRect.left + (item.targetRect.width / 2) - 10,
                width: 20,
                height: 20,
                opacity: 0,
                borderRadius: '50%'
            }));
        });

        const timer = setTimeout(onComplete, FLYING_ANIMATION_DURATION_MS);
        return () => clearTimeout(timer);
    }, [item, onComplete]);

    return <img src={item.src} style={style} alt="" className="shadow-xl" />;
};
