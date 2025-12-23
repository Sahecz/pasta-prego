
export type CategoryId = 'pastas-clasicas' | 'pastas-especiales' | 'salsas' | 'bebidas' | 'postres';

export interface Category {
  id: CategoryId;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: CategoryId;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  type: 'protein' | 'topping';
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for the item in the cart (to distinguish variations)
  quantity: number;
  selectedExtras?: Extra[];
}

export interface OrderForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export type ViewState = 'home' | 'menu' | 'cart' | 'checkout' | 'success';

export interface OrderSummary {
  orderNumber: string;
  items: CartItem[];
  total: number;
  customer: OrderForm;
}
