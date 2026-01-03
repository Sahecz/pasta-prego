import React, { useState, useEffect } from 'react';


// Flying Image Component for Animation
export interface FlyingItem {
    id: number;
    src: string;
    startRect: DOMRect;
    targetRect: DOMRect;
}

export const FlyingImage: React.FC<{ item: FlyingItem; onComplete: () => void }> = ({ item, onComplete }) => {
    const [style, setStyle] = useState<React.CSSProperties>({
        position: 'fixed',
        top: item.startRect.top,
        left: item.startRect.left,
        width: item.startRect.width,
        height: item.startRect.height,
        opacity: 1,
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
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
                width: '20px',
                height: '20px',
                opacity: 0,
                borderRadius: '50%'
            }));
        });

        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
    }, [item, onComplete]);

    return <img src={item.src} style={style} alt="" className="shadow-xl" />;
};