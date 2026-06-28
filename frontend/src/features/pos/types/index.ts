export interface Product {
  id: string;
  name: string;
  defaultPrice: number;
  [key: string]: any;
}

export interface Depot {
  id: string;
  name: string;
  [key: string]: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}
