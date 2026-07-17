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
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  defaultPrice: number;
  costPrice: number;
  isActive?: boolean;
  categoryId?: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
}

export interface Customer {
  id: string;
  type: string;
  companyName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
  creditLimit?: number;
  currentDebt?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface SaleLine {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customer?: Customer;
  depotId: string;
  depot?: Depot;
  totalAmount: number;
  taxAmount?: number;
  amountPaid: number;
  status: string;
  type: string;
  dueDate?: string;
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
  type?: string;
}

export interface PurchaseOrderLine {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  receivingDepotId?: string;
  receivingDepot?: Depot;
  expectedDate?: string;
  status: string;
  totalAmount: number;
  amountPaid: number;
  date?: string;
  createdAt: string;
  lines?: PurchaseOrderLine[];
}

export interface StockMovement {
  id: string;
  type: 'IN' | 'OUT' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  quantityChanged: number;
  productId: string;
  product?: Product;
  depotId: string;
  depot?: Depot;
  userId: string;
  user?: User;
  reference?: string;
  date?: string;
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

export interface StockTransfer {
  id: string;
  reference: string;
  status: 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  quantity: number;
  productId: string;
  product?: Product;
  fromDepotId: string;
  fromDepot?: Depot;
  toDepotId: string;
  toDepot?: Depot;
  dispatchedById: string;
  dispatchedBy?: { fullName: string };
  receivedById?: string;
  receivedBy?: { fullName: string };
  dispatchedAt: string;
  receivedAt?: string;
}

/**
 * Réponse paginée standardisée (alignée avec le backend).
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
