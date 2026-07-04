export type Category = 
  | "Académico" 
  | "Comida" 
  | "Tecnología" 
  | "Vida Diaria" 
  | "Otros Servicios" 
  | "Otros Productos";

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: Category;
  sellerName: string;
  isPro: boolean;
  isBoosted: boolean;
  imageUrl?: string;
  status?: string;
  seller_id?: string;
  type?: "Producto" | "Servicio";
  stock?: number;
}

export const CATEGORIES: Category[] = [
  "Académico",
  "Comida",
  "Tecnología",
  "Vida Diaria",
  "Otros Servicios",
  "Otros Productos",
];

export const DUMMY_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Almuerzo Casero - Lomo Saltado",
    price: 15.00,
    category: "Comida",
    sellerName: "Andrea Vizcarra",
    isPro: false,
    isBoosted: true,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Polera Oficial San Marcos - Talla M",
    price: 45.00,
    category: "Otros Productos",
    sellerName: "Marco Aurelio",
    isPro: true,
    isBoosted: true,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Asesoría Cálculo III - Temas 1 al 5",
    price: 25.00,
    category: "Académico",
    sellerName: "Carlos Pérez",
    isPro: true,
    isBoosted: false,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Ticket de Comedor - Almuerzo (Viernes)",
    price: 5.50,
    category: "Vida Diaria",
    sellerName: "Ana Martínez",
    isPro: false,
    isBoosted: false,
    imageUrl: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Formateo de Laptop + Antivirus",
    price: 40.00,
    category: "Tecnología",
    sellerName: "Diego Sánchez",
    isPro: true,
    isBoosted: false,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Resúmenes Derecho Civil II",
    price: 10.00,
    category: "Académico",
    sellerName: "Estefany López",
    isPro: false,
    isBoosted: false,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
  },
];
