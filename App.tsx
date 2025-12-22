
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle, Utensils, MapPin, Phone, User, FileText, ChevronRight, X, AlertCircle, Info } from 'lucide-react';
import { CATEGORIES, PRODUCTS, EXTRA_PROTEINS, EXTRA_TOPPINGS } from './constants';
import { CartItem, Product, CategoryId, ViewState, OrderForm, OrderSummary, Extra } from './types';

// --- Helper Components ---

// Button Component
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled, type = 'button', fullWidth }) => {
  const baseClasses = "py-3 px-6 rounded-full font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-brand-orange text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100",
    secondary: "bg-white text-brand-dark shadow-md hover:shadow-lg border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10 disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
  };

  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Flying Image Component for Animation
interface FlyingItem {
  id: number;
  src: string;
  startRect: DOMRect;
  targetRect: DOMRect;
}

const FlyingImage: React.FC<{ item: FlyingItem; onComplete: () => void }> = ({ item, onComplete }) => {
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

// Customization Modal
interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, extras: Extra[], e: React.MouseEvent) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
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
              <Utensils size={18} className="text-brand-orange"/> Extra Proteína
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

  // --- Views ---

  const HomeView = () => (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-white animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=1600" 
          alt="Delicious Pasta" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-6xl md:text-8xl text-white font-bold mb-4 drop-shadow-lg tracking-tight">
            Pasta <span className="text-brand-orange italic">Prè-gō</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-lg mb-8 font-light">
            Sabor italiano auténtico, ingredientes frescos y pasión en cada plato. Directo a tu puerta.
          </p>
          <Button onClick={() => setView('menu')} className="px-10 py-4 text-lg animate-bounce">
            Hacer Pedido
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Highlights */}
      <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Utensils className="text-brand-orange" size={32} />, title: "Artesanal", desc: "Pasta fresca hecha a mano diariamente." },
          { icon: <CheckCircle className="text-brand-orange" size={32} />, title: "Calidad", desc: "Ingredientes importados de Italia." },
          { icon: <MapPin className="text-brand-orange" size={32} />, title: "Rápido", desc: "Entrega veloz en toda la ciudad." },
        ].map((feature, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              {feature.icon}
            </div>
            <h3 className="font-serif text-2xl text-brand-dark mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const MenuView = () => {
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
                    onClick={(e) => handleAddToCartClick(product, e)} 
                    fullWidth 
                    variant="outline"
                    className={`${isAddingId === product.id ? 'bg-brand-orange !text-white' : ''}`}
                  >
                     {isAddingId === product.id ? (
                       <span className="flex items-center gap-2">Agregado <CheckCircle size={16}/></span>
                     ) : (
                       <span className="flex items-center gap-2">
                         {(product.categoryId === 'pastas-clasicas' || product.categoryId === 'pastas-especiales') 
                            ? 'Personalizar' 
                            : 'Agregar'} 
                         <Plus size={16}/>
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

  const CartView = () => {
    // Suggestions Logic: Not in cart, prioritized categories (bebidas, postres)
    const suggestions = useMemo(() => {
      const inCartIds = new Set(cart.map(i => i.id));
      const candidates = PRODUCTS.filter(p => !inCartIds.has(p.id));
      
      const priority = candidates.filter(p => ['bebidas', 'postres'].includes(p.categoryId));
      const others = candidates.filter(p => !['bebidas', 'postres'].includes(p.categoryId));
      
      // Combine: up to 3 priority items, fill with others if needed
      return [...priority, ...others].slice(0, 3);
    }, [cart]);

    if (cart.length === 0) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
          <div className="bg-white p-6 rounded-full shadow-lg mb-6">
            <ShoppingCart size={48} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">¡Nuestras pastas te están esperando!</p>
          <Button onClick={() => setView('menu')}>Ir al Menú</Button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8">Tu Pedido</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Item List */}
          <div className="flex-1">
            <div className="space-y-4 mb-8">
              {cart.map(item => {
                const itemBasePrice = item.price;
                const extrasTotal = item.selectedExtras?.reduce((sum, e) => sum + e.price, 0) || 0;
                const itemTotal = itemBasePrice + extrasTotal;
                
                return (
                <div key={item.cartItemId} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 animate-fade-in-up items-start z-10 group/item">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-brand-dark truncate pr-2">{item.name}</h3>
                      
                      {/* Price with Tooltip */}
                      <div className="relative group flex flex-col items-end">
                        <p className="text-brand-orange font-bold whitespace-nowrap cursor-help border-b border-dashed border-brand-orange/30">
                          ${itemTotal.toFixed(2)}
                        </p>
                        
                        {/* Breakdown Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-brand-dark text-white text-xs rounded-xl p-3 shadow-xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-gray-300">
                              <span>Base ({item.name})</span>
                              <span>${itemBasePrice.toFixed(2)}</span>
                            </div>
                            {item.selectedExtras?.map((extra, idx) => (
                              <div key={`${extra.id}-${idx}`} className="flex justify-between text-gray-400">
                                <span>+ {extra.name}</span>
                                <span>${extra.price.toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-600 my-1 pt-1 flex justify-between font-bold text-white">
                              <span>Precio Unitario</span>
                              <span>${itemTotal.toFixed(2)}</span>
                            </div>
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-brand-dark"></div>
                        </div>
                      </div>

                    </div>
                    
                    {/* Display Extras */}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                        {item.selectedExtras.map(extra => (
                          <div key={extra.id} className="flex justify-between gap-2">
                            <span>+ {extra.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-brand-orange"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-brand-orange"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-serif font-bold text-xl text-brand-dark mb-4">También te podría interesar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {suggestions.map(product => (
                    <div key={product.id} className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col gap-3 group">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">${product.price.toFixed(2)}</p>
                        <Button 
                          onClick={(e) => handleAddToCartClick(product, e)} 
                          variant="outline" 
                          className="w-full !py-1.5 !px-2 text-xs"
                        >
                          <Plus size={14} /> Agregar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary & Action */}
          <div className="lg:w-80 h-fit sticky top-24 z-0">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Resumen</h3>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Envío</span>
                <span>$2.50</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between mb-6">
                <span className="font-bold text-xl">Total</span>
                <span className="font-bold text-xl text-brand-orange">${(cartTotal + 2.50).toFixed(2)}</span>
              </div>
              <Button onClick={() => setView('checkout')} fullWidth>
                Continuar Compra
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutView = () => {
    const [form, setForm] = useState<OrderForm>({ name: '', phone: '', address: '', notes: '' });
    const [touched, setTouched] = useState<Record<keyof OrderForm, boolean>>({
      name: false,
      phone: false,
      address: false,
      notes: false
    });

    const errors = useMemo(() => {
      const newErrors: Partial<Record<keyof OrderForm, string>> = {};
      
      if (!form.name.trim()) {
        newErrors.name = 'El nombre es obligatorio.';
      } else if (form.name.trim().length < 3) {
        newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
      }

      const phoneRegex = /^[\d\s\-+()]{7,}$/;
      if (!form.phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio.';
      } else if (!phoneRegex.test(form.phone.trim())) {
        newErrors.phone = 'Ingresa un teléfono válido (mín. 7 dígitos).';
      }

      if (!form.address.trim()) {
        newErrors.address = 'La dirección es obligatoria.';
      } else if (form.address.trim().length < 5) {
        newErrors.address = 'La dirección es demasiado corta.';
      }

      return newErrors;
    }, [form]);

    const isFormValid = Object.keys(errors).length === 0;

    const handleBlur = (field: keyof OrderForm) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (field: keyof OrderForm, value: string) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isFormValid) {
        handlePlaceOrder(form);
      } else {
        setTouched({
          name: true,
          phone: true,
          address: true,
          notes: true
        });
      }
    };

    const getInputClass = (field: keyof OrderForm) => {
      const base = "w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-colors";
      if (touched[field] && errors[field]) {
        return `${base} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50`;
      }
      return `${base} border-gray-200 focus:ring-brand-orange focus:border-transparent`;
    };

    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <button onClick={() => setView('cart')} className="flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-6">
          <ArrowLeft size={20} /> Volver al carrito
        </button>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-brand-orange">
          <h2 className="text-2xl font-serif font-bold mb-6">Detalles de Entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className={`absolute left-3 top-3 ${touched.name && errors.name ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                <input 
                  type="text" 
                  className={getInputClass('name')}
                  placeholder="Juan Pérez"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                />
              </div>
              {touched.name && errors.name && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in-up">
                  <AlertCircle size={12} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-3 ${touched.phone && errors.phone ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                  <input 
                    type="tel" 
                    className={getInputClass('phone')}
                    placeholder="555-0000"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in-up">
                    <AlertCircle size={12} />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-3 ${touched.address && errors.address ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                  <input 
                    type="text" 
                    className={getInputClass('address')}
                    placeholder="Calle Principal 123"
                    value={form.address}
                    onChange={e => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                  />
                </div>
                {touched.address && errors.address && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in-up">
                    <AlertCircle size={12} />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas Especiales (Opcional)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Sin cebolla, código de puerta..."
                  value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  onBlur={() => handleBlur('notes')}
                />
              </div>
            </div>

            <Button type="submit" fullWidth className="mt-4 text-lg" disabled={!isFormValid}>
              {isFormValid ? `Confirmar Pedido - $${(cartTotal + 2.50).toFixed(2)}` : 'Completa el formulario'}
            </Button>
          </form>
        </div>
      </div>
    );
  };

  const SuccessView = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-orange/10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-orange/10 rounded-full"></div>
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">¡Grazie Mille!</h2>
        <p className="text-gray-500 mb-6">Tu pedido ha sido recibido y la cocina ya está trabajando en ello.</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Número de Orden</p>
          <p className="text-2xl font-mono font-bold text-brand-orange">{orderSummary?.orderNumber}</p>
        </div>

        <div className="space-y-2 text-left text-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-4">
           <div className="flex justify-between">
             <span>Cliente:</span>
             <span className="font-medium">{orderSummary?.customer.name}</span>
           </div>
           <div className="flex justify-between">
             <span>Dirección:</span>
             <span className="font-medium">{orderSummary?.customer.address}</span>
           </div>
           <div className="flex justify-between">
             <span>Total:</span>
             <span className="font-medium">${((orderSummary?.total || 0) + 2.50).toFixed(2)}</span>
           </div>
        </div>

        <Button onClick={() => setView('home')} fullWidth variant="secondary">
          Volver al Inicio
        </Button>
      </div>
    </div>
  );

  // --- Layout Wrapper ---

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans selection:bg-brand-orange selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-[70px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => setView('home')} className="flex items-center group">
            <div className="font-serif text-2xl font-bold tracking-tight text-brand-dark">
              Pasta <span className="text-brand-orange italic group-hover:underline decoration-2 underline-offset-4">Prè-gō</span>
            </div>
          </button>

          {/* Nav & Cart */}
          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden md:flex gap-6 font-medium text-sm text-gray-600">
              <button onClick={() => setView('home')} className={`hover:text-brand-orange ${view === 'home' ? 'text-brand-orange' : ''}`}>Inicio</button>
              <button onClick={() => setView('menu')} className={`hover:text-brand-orange ${view === 'menu' ? 'text-brand-orange' : ''}`}>Menú</button>
            </nav>

            <button 
              ref={cartBtnRef}
              onClick={() => setView('cart')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
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
        {view === 'home' && <HomeView />}
        {view === 'menu' && <MenuView />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
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
                Auténtica cocina italiana entregada con pasión. <br/>
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
            © 2024 Pasta Prè-gō. Todos los derechos reservados.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
