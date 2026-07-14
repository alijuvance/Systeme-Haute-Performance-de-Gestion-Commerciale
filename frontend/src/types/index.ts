export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  roleId: string;
  role?: Role;
  depotId?: string | null;
  depot?: Depot;
  isActive?: boolean;
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  sku?: string;
  categoryId?: string;
  category?: Category;
  description?: string;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface SaleLine {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  reference: string;
  invoiceNumber?: string;
  customerId?: string;
  customer?: Customer;
  totalAmount: number;
  amountPaid: number;
  status: string;
  type?: string;
  date?: string;
  createdAt: string;
  lines?: SaleLine[];
}

export interface AnalyticsKpis {
  totalRevenue: number;
  commercialMargin: number;
  totalReceivables: number;
  totalCogs: number;
}

export interface Depot {
  id: string;
  name: string;
  location?: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  purchaseId: string;
}

export interface Purchase {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  status: string;
  totalAmount: number;
  amountPaid: number;
  createdAt: string;
  items?: PurchaseItem[];
}

export interface StockMovement {
  id: string;
  type: 'IN' | 'OUT';
  quantityChanged: number;
  productId: string;
  product?: Product;
  depotId: string;
  depot?: Depot;
  reference?: string;
  createdAt: string;
}

export interface StockLevel {
  id: string;
  productId: string;
  product?: Product;
  depotId: string;
  depot?: Depot;
  quantity: number;
  minAlertQuantity?: number;
  firstAddedAt?: string;
  lastAddedAt?: string;
}
