
import { Category, Product, Extra } from './types';

export const CATEGORIES: Category[] = [
  { id: 'pastas-clasicas', name: 'Pastas Clásicas' },
  { id: 'pastas-especiales', name: 'Especialidades' },
  { id: 'salsas', name: 'Salsas Extra' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'postres', name: 'Postres' },
];

export const EXTRA_PROTEINS: Extra[] = [
  { id: 'prot-1', name: 'Pollo a la plancha', price: 3.50, type: 'protein' },
  { id: 'prot-2', name: 'Albóndigas (2 pz)', price: 4.00, type: 'protein' },
  { id: 'prot-3', name: 'Tocino Crujiente', price: 2.50, type: 'protein' },
  { id: 'prot-4', name: 'Camarones', price: 5.00, type: 'protein' },
];

export const EXTRA_TOPPINGS: Extra[] = [
  { id: 'top-1', name: 'Champiñones', price: 1.50, type: 'topping' },
  { id: 'top-2', name: 'Espinaca Fresca', price: 1.00, type: 'topping' },
  { id: 'top-3', name: 'Brócoli al vapor', price: 1.50, type: 'topping' },
  { id: 'top-4', name: 'Tomate Deshidratado', price: 2.00, type: 'topping' },
  { id: 'top-5', name: 'Tomate Cherry', price: 1.50, type: 'topping' },
  { id: 'top-6', name: 'Aceituna Negra', price: 1.00, type: 'topping' },
  { id: 'top-7', name: 'Parmesano Romano', price: 2.00, type: 'topping' },
  { id: 'top-8', name: 'Parmesano Reggiano', price: 2.50, type: 'topping' },
];

export const PRODUCTS: Product[] = [
  // Pastas Clásicas
  {
    id: 'p1',
    name: 'Spaghetti Pomodoro',
    description: 'Nuestra pasta fresca con salsa de tomate San Marzano y albahaca fresca.',
    price: 12.50,
    categoryId: 'pastas-clasicas',
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    name: 'Fettuccine Alfredo',
    description: 'Cremosa salsa de parmesano reggiano y mantequilla.',
    price: 13.90,
    categoryId: 'pastas-clasicas',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    name: 'Penne Arrabbiata',
    description: 'Salsa de tomate picante con ajo y perejil.',
    price: 11.90,
    categoryId: 'pastas-clasicas',
    image: 'https://images.unsplash.com/photo-1608835291093-394b0c943a75?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p6',
    name: 'Boloñesa Originale',
    description: 'La auténtica receta de Bologna, cocinada a fuego lento por 8 horas.',
    price: 15.50,
    categoryId: 'pastas-clasicas',
    image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p7',
    name: 'La Alfredo Clásica',
    description: 'Doble crema, pimienta negra molida y extra queso.',
    price: 14.50,
    categoryId: 'pastas-clasicas',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p8',
    name: 'Carbonara Romana',
    description: 'Sin crema. Solo yema de huevo, pecorino, guanciale y pimienta negra.',
    price: 16.00,
    categoryId: 'pastas-clasicas',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800'
  },
  
  // Pastas Especiales
  {
    id: 'p4',
    name: 'Ravioli de Trufa',
    description: 'Rellenos de setas y trufa negra en salsa ligera de mantequilla y salvia.',
    price: 18.00,
    categoryId: 'pastas-especiales',
    image: 'https://images.unsplash.com/photo-1587740986335-9c9974127494?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p5',
    name: 'Lasagna de la Nonna',
    description: 'Capas de pasta fresca, boloñesa cocida a fuego lento y bechamel.',
    price: 16.50,
    categoryId: 'pastas-especiales',
    image: 'https://images.unsplash.com/photo-1574868291053-126e9939663c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p9',
    name: 'Chipotle Di Mexico',
    description: 'Fusión italo-mexicana. Pasta cremosa con un toque ahumado de chipotle.',
    price: 15.90,
    categoryId: 'pastas-especiales',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p10',
    name: 'Veggie Mediterránea',
    description: 'Salteada con pimientos, calabacín, berenjena y aceite de oliva virgen extra.',
    price: 14.90,
    categoryId: 'pastas-especiales',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p11',
    name: 'Funghi Supremo',
    description: 'Mezcla de hongos silvestres, porcini y aceite de trufa blanca.',
    price: 17.50,
    categoryId: 'pastas-especiales',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800'
  },

  // Salsas
  {
    id: 's1',
    name: 'Pesto Genovese',
    description: 'Porción extra de nuestro pesto casero.',
    price: 3.50,
    categoryId: 'salsas',
    image: 'https://images.unsplash.com/photo-1599818816757-41472852230a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's2',
    name: 'Boloñesa',
    description: 'Ragú clásico de carne.',
    price: 4.50,
    categoryId: 'salsas',
    image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=800'
  },
  // Bebidas
  {
    id: 'b1',
    name: 'Limonada Siciliana',
    description: 'Limonada casera con menta.',
    price: 4.00,
    categoryId: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    name: 'Vino Tinto de la Casa',
    description: 'Copa de Chianti clásico.',
    price: 6.00,
    categoryId: 'bebidas',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800'
  },
  // Postres
  {
    id: 'd1',
    name: 'Tiramisú',
    description: 'El clásico italiano con mascarpone y café espresso.',
    price: 7.50,
    categoryId: 'postres',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'd2',
    name: 'Panna Cotta',
    description: 'Con coulis de frutos rojos.',
    price: 6.50,
    categoryId: 'postres',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
  },
];
