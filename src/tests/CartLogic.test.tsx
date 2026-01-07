import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useCart } from '../hooks/useCart';
import { Product, Extra } from '../types';

// Mock data
const mockProduct: Product = {
    id: 'p1',
    name: 'Test Pasta',
    price: 10.0,
    description: 'Desc',
    categoryId: 'pastas-clasicas',
    image: 'img.jpg'
};

const mockExtra: Extra = {
    id: 'e1',
    name: 'Extra Cheese',
    price: 2.0,
    type: 'topping'
};

describe('useCart Hook Logic', () => {
    it('should start with an empty cart', () => {
        const { result } = renderHook(() => useCart());
        expect(result.current.cart).toEqual([]);
        expect(result.current.cartTotal).toBe(0);
    });
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        vi.useRealTimers();
    });

    it('should add a product correctly', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(mockProduct, []);
        });

        // Fast-forward time to skip the 600ms animation delay
        act(() => {
            vi.advanceTimersByTime(600);
        });

        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].name).toBe('Test Pasta');
        expect(result.current.cartTotal).toBe(10.0);

        vi.useRealTimers();
    });
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        vi.useRealTimers();
    });

    it('should calculate total with extras correctly', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(mockProduct, [mockExtra]);
        });

        act(() => {
            vi.advanceTimersByTime(600);
        });

        console.log(result.current.cart);
        expect(result.current.cart).toHaveLength(1);
        // Base price (10) + Extra (2) = 12
        expect(result.current.cartTotal).toBe(12.0);

        vi.useRealTimers();
    });
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        vi.useRealTimers();
    });
});
