import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useCartContext } from './context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Product, CategoryId, OrderForm, OrderSummary, Extra } from './types';

import { FlyingImage } from './components/FlyingImage'
import { ProductModal } from './components/ProductModal';

const Home = React.lazy(() => import('./views/Home').then(module => ({ default: module.Home })));
const Menu = React.lazy(() => import('./views/Menu').then(module => ({ default: module.Menu })));
const Cart = React.lazy(() => import('./views/Cart').then(module => ({ default: module.Cart })));
const Checkout = React.lazy(() => import('./views/Checkout').then(module => ({ default: module.Checkout })));
const Success = React.lazy(() => import('./views/Success').then(module => ({ default: module.Success })));

// --- Main App Component ---

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('pastas-clasicas');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // Customization State
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Cart Hook
  const {
    cart,
    cartTotal,
    cartItemCount,
    flyingItems,
    cartBtnRef,
    addToCart,
    clearCart,
    removeFlyingItem
  } = useCartContext();

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

  const onAddToCartWrapper = (product: Product, extras: Extra[], e?: React.MouseEvent) => {
    addToCart(product, extras, e);
    setCustomizingProduct(null);
  };

  const handlePlaceOrder = (formData: OrderForm) => {
    const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setOrderSummary({
      orderNumber,
      items: [...cart],
      total: cartTotal,
      customer: formData
    });
    clearCart();
  };

  // --- Layout Wrapper ---
  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans selection:bg-brand-orange selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-[70px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="cursor-pointer flex items-center group">
            <div className="font-serif text-2xl font-bold tracking-tight text-brand-dark">
              Pasta <span className="text-brand-orange italic group-hover:underline decoration-2 underline-offset-4">Prè-gō</span>
            </div>
          </Link>

          {/* Nav & Cart */}
          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden md:flex gap-6 font-medium text-sm text-gray-600">
              <Link to="/" className="cursor-pointer hover:text-brand-orange">Inicio</Link>
              <Link to="/menu" className="cursor-pointer hover:text-brand-orange">Menú</Link>
            </nav>

            <Link
              ref={cartBtnRef}
              to="/cart"
              className="cursor-pointer relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={24} className="text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-fade-in">
        <React.Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu onAddToCartClick={handleAddToCartClick} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />} />
            <Route path="/cart" element={<Cart handleAddToCartClick={handleAddToCartClick} />} />
            <Route path="/checkout" element={<Checkout onPlaceOrder={handlePlaceOrder} />} />
            <Route path="/success" element={<Success orderSummary={orderSummary} />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Customization Modal */}
      {customizingProduct && (
        <ProductModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={onAddToCartWrapper}
        />
      )}

      {/* Flying Animations */}
      {flyingItems.map(item => (
        <FlyingImage
          key={item.id}
          item={item}
          onComplete={() => removeFlyingItem(item.id)}
        />
      ))}

      {/* Footer */}
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
              <li><Link to="/menu" className="hover:text-white transition-colors">Menú Completo</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Términos y Condiciones</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-gray-300">Contacto</h4>
            <p className="text-gray-400 text-sm">
              <span className="block mb-1">Blvrd Constitución 677-B, Las Margaritas, Torreón, Coah.</span>
              <span className="block mb-1">pastapregotrc@gmail.com</span>
              <span className="block">+52 pasta</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          © 2026 Pasta Prè-gō. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App;
