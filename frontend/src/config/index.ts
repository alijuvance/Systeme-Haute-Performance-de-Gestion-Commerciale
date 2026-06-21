export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  APP_NAME: 'ERP High Performance',
  APP_VERSION: '1.0.0',
  DEFAULT_CURRENCY: 'MGA',
  DEFAULT_LOCALE: 'fr-MG',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  THEME: {
    DEFAULT_MODE: 'system', // 'light' | 'dark' | 'system'
  }
};
