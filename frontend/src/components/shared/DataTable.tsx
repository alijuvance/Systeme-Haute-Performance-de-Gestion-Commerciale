import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  pageSize?: number;
  showPagination?: boolean;
  showResultCount?: boolean;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  isLoading,
  emptyMessage = "Aucune donnée trouvée.",
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  pageSize = 20,
  showPagination = true,
  showResultCount = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col || !col.sortFn) return data;
    return [...data].sort((a, b) => {
      const result = col.sortFn!(a, b);
      return sortDir === 'desc' ? -result : result;
    });
  }, [data, sortKey, sortDir, columns]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = showPagination 
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const handleSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null); }
      else setSortDir('asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
    if (sortDir === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-gray-900" />;
    return <ChevronDown className="w-3.5 h-3.5 text-gray-900" />;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Skeleton header */}
        <div className="border-b border-gray-100 px-4 py-3 flex gap-4">
          {columns.map((col) => (
            <div key={col.key} className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: col.width || '120px' }} />
          ))}
        </div>
        {/* Skeleton rows */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className="px-4 py-3.5 flex gap-4 border-b border-gray-50">
            {columns.map((col, colIdx) => (
              <div key={col.key} className="h-4 bg-gray-50 rounded animate-pulse" style={{ width: col.width || `${60 + (((i * 7) + colIdx * 11) % 80)}px` }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Result count */}
      {showResultCount && data.length > 0 && (
        <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {paginatedData.length === data.length 
              ? `${data.length} résultat${data.length > 1 ? 's' : ''}`
              : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, data.length)} sur ${data.length}`
            }
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap select-none ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:text-gray-700 transition-colors' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState 
                    title={emptyMessage} 
                    icon={emptyIcon}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr 
                  key={keyExtractor(row)} 
                  className="hover:bg-gray-50/50 transition-colors duration-150 group"
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={`px-4 py-3 text-gray-700 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                    currentPage === pageNum 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
