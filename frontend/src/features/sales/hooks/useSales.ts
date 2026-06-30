import { useState, useEffect, useMemo } from 'react';
import { getSales } from '../api/getSales';

export const useSales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const data = await getSales();
        setSales(data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des ventes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      let matches = true;

      // Text search (invoice number, customer name, company name)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const customerName = (s.customer?.fullName || '').toLowerCase();
        const companyName = (s.customer?.companyName || '').toLowerCase();
        const invoiceNum = (s.invoiceNumber || '').toLowerCase();
        
        if (!customerName.includes(term) && !companyName.includes(term) && !invoiceNum.includes(term)) {
          matches = false;
        }
      }

      // Date filter
      if (dateFilter && matches) {
        const saleDate = new Date(s.date).toISOString().split('T')[0];
        if (saleDate !== dateFilter) {
          matches = false;
        }
      }

      // Type filter
      if (typeFilter && matches) {
        if (s.type !== typeFilter) matches = false;
      }

      // Status filter
      if (statusFilter && matches) {
        if (s.status !== statusFilter) matches = false;
      }

      return matches;
    });
  }, [sales, searchTerm, dateFilter, typeFilter, statusFilter]);

  return { 
    sales: filteredSales, 
    isLoading, 
    error,
    searchTerm, setSearchTerm,
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter
  };
};
