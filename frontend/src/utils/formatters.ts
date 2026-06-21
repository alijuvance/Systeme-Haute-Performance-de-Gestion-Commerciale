export const formatCurrency = (val: number | undefined | null) => {
  return new Intl.NumberFormat('fr-MG', { 
    style: 'currency', 
    currency: 'MGA' 
  }).format(val || 0);
};

export const formatDate = (dateInput: string | Date | undefined | null) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateInput: string | Date | undefined | null) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
