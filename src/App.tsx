
import React, { useState, useMemo, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { CartItem, Product, CategoryId, ViewState, OrderForm, OrderSummary, Extra } from './types';

import { Home } from './views/Home'
import { Success } from './views/Success'
import { Checkout } from './views/Checkout'
import { Menu } from './views/Menu';
import { Cart } from './views/Cart';

import { FlyingImage, FlyingItem } from './components/FlyingImage'
import { ProductModal } from './components/ProductModal';

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('pastas-clasicas');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isAddingId, setIsAddingId] = useState<string | null>(null);

  // Customization State
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Animation State
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartBtnRef = useRef<HTMLButtonElement>(null);

  // Derived State
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const extrasCost = item.selectedExtras ? item.selectedExtras.reduce((sum, e) => sum + e.price, 0) : 0;
      return total + ((item.price + extrasCost) * item.quantity);
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Actions

  // Handle Click on "Add" button in Menu
  const handleAddToCartClick = (product: Product, e: React.MouseEvent) => {
    // If it's a pasta, open customization modal
    if (product.categoryId === 'pastas-clasicas' || product.categoryId === 'pastas-especiales') {
      setCustomizingProduct(product);
    } else {
      // Otherwise add directly
      addToCart(product, [], e);
    }
  };

  const addToCart = (product: Product, extras: Extra[], e?: React.MouseEvent) => {
    setIsAddingId(product.id);
    setCustomizingProduct(null); // Close modal if open

    // Calculate a unique ID based on product + sorted extras
    const extrasId = extras.length > 0
      ? '-' + extras.map(e => e.id).sort().join('-')
      : '';
    const cartItemId = `${product.id}${extrasId}`;

    // Trigger Flying Animation
    if (e && cartBtnRef.current) {
      const targetBtn = e.currentTarget as HTMLElement;
      // Try to find image in modal first, then in card
      let img = targetBtn.closest('.group')?.querySelector('img') as HTMLImageElement; // Card image

      // If triggered from modal (no .group parent usually), try to find the modal image
      if (!img) {
        // Fallback logic for modal animation source
        const modalContent = targetBtn.closest('.fixed');
        if (modalContent) {
          img = modalContent.querySelector('img') as HTMLImageElement;
        }
      }

      if (img) {
        const startRect = img.getBoundingClientRect();
        const targetRect = cartBtnRef.current.getBoundingClientRect();

        setFlyingItems(prev => [...prev, {
          id: Date.now(),
          src: product.image,
          startRect,
          targetRect
        }]);
      }
    }

    // Update Cart with delay to match animation landing
    setTimeout(() => {
      setCart(prev => {
        const existing = prev.find(item => item.cartItemId === cartItemId);
        if (existing) {
          return prev.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1, selectedExtras: extras, cartItemId }];
      });
      setIsAddingId(null);
    }, 600);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = (formData: OrderForm) => {
    const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setOrderSummary({
      orderNumber,
      items: [...cart],
      total: cartTotal,
      customer: formData
    });
    setCart([]);
    setView('success');
    window.scrollTo(0, 0);
  };

  // --- Layout Wrapper ---

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans selection:bg-brand-orange selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-[70px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => setView('home')} className="cursor-pointer flex items-center group">
            <div className="font-serif text-2xl font-bold tracking-tight text-brand-dark">
              Pasta <span className="text-brand-orange italic group-hover:underline decoration-2 underline-offset-4">Prè-gō</span>
            </div>
          </button>

          {/* Nav & Cart */}
          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden md:flex gap-6 font-medium text-sm text-gray-600">
              <button onClick={() => setView('home')} className={`cursor-pointer hover:text-brand-orange ${view === 'home' ? 'text-brand-orange' : ''}`}>Inicio</button>
              <button onClick={() => setView('menu')} className={`cursor-pointer hover:text-brand-orange ${view === 'menu' ? 'text-brand-orange' : ''}`}>Menú</button>
            </nav>

            <button
              ref={cartBtnRef}
              onClick={() => setView('cart')}
              className="cursor-pointer relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={24} className={view === 'cart' ? 'text-brand-orange' : 'text-gray-700'} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-fade-in">
        {view === "home" && <Home onGoToMenu={() => setView("menu")} />}
        {view === 'menu' && <Menu onAddToCartClick={handleAddToCartClick} isAddingId={isAddingId} activeCategory={activeCategory} setActiveCategory={setActiveCategory} cartTotal={cartTotal} />}
        {view === 'cart' && <Cart cart={cart} setView={setView} updateQuantity={updateQuantity} removeFromCart={removeFromCart} handleAddToCartClick={handleAddToCartClick} cartTotal={cartTotal} />}
        {view === 'checkout' && <Checkout onGoCart={() => setView('cart')} cartTotal={cartTotal} onPlaceOrder={handlePlaceOrder} />}
        {view === 'success' && <Success orderSummary={orderSummary} onGoHome={() => setView("home")} />}
      </main>

      {/* Customization Modal */}
      {customizingProduct && (
        <ProductModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Flying Animations */}
      {flyingItems.map(item => (
        <FlyingImage
          key={item.id}
          item={item}
          onComplete={() => setFlyingItems(prev => prev.filter(i => i.id !== item.id))}
        />
      ))}

      {/* Footer */}
      {view !== 'success' && (
        <footer className="bg-brand-dark text-white py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Pasta <span className="text-brand-orange italic">Prè-gō</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Auténtica cocina italiana entregada con pasión. <br />
                La vida es una combinación de magia y pasta.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-gray-300">Enlaces</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => setView('menu')} className="hover:text-white transition-colors">Menú Completo</button></li>
                <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Sobre Nosotros</button></li>
                <li><span className="cursor-pointer hover:text-white transition-colors">Términos y Condiciones</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-gray-300">Contacto</h4>
              <p className="text-gray-400 text-sm">
                <span className="block mb-1">Calle de la Pasta 42, Roma</span>
                <span className="block mb-1">ciao@pastaprego.com</span>
                <span className="block">+39 123 456 789</span>
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
            © 2026 Pasta Prè-gō. Todos los derechos reservados.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
