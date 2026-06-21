export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
} as const;

export const SALE_STATUS = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export const STOCK_STATUS = {
  OK: 'OK',
  WARNING: 'WARNING',
  OUT_OF_STOCK: 'RUPTURE',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  SALES: '/api/sales',
  PRODUCTS: '/api/products',
  CUSTOMERS: '/api/customers',
  DEPOTS: '/api/depots',
  ANALYTICS: {
    KPIS: '/api/analytics/kpis',
    SALES_CHART: '/api/analytics/sales-chart',
  }
} as const;
