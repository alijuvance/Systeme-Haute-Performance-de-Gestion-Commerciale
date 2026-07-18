import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, AuditLog } from '../api/auditApi';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAuditLogs({
        page,
        limit: 20,
        search: searchTerm || undefined,
        entity: entityFilter || undefined,
        action: actionFilter || undefined,
      });
      setLogs(res.data);
      setTotal(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des logs.');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, entityFilter, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs, total, isLoading, error,
    page, setPage,
    searchTerm, setSearchTerm,
    entityFilter, setEntityFilter,
    actionFilter, setActionFilter,
    refreshData: fetchLogs
  };
};
