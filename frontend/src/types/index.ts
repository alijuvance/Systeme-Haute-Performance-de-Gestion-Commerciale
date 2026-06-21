export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: any;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  categoryId?: string;
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

export interface Sale {
  id: string;
  reference: string;
  customerId?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface AnalyticsKpis {
  totalRevenue: number;
  commercialMargin: number;
  totalReceivables: number;
  totalCogs: number;
}
