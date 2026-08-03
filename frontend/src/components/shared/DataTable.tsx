import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
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
  searchable?: boolean;
  searchPlaceholder?: string;
  exportable?: boolean;
  exportFilename?: string;
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
  searchable = false,
  searchPlaceholder = "Rechercher...",
  exportable = false,
  exportFilename = "export_donnees.csv",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalSearch, setGlobalSearch] = useState('');

  // ─── Filter ───
  const filteredData = useMemo(() => {
    if (!searchable || !globalSearch.trim()) return data;
    const lowerSearch = globalSearch.toLowerCase();
    return data.filter(item => {
      return Object.values(item as any).some(val =>
        val && String(val).toLowerCase().includes(lowerSearch)
      );
    });
  }, [data, searchable, globalSearch]);

  // ─── Sort ───
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    const col = columns.find(c => c.key === sortKey);
    if (!col || !col.sortFn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const result = col.sortFn!(a, b);
      return sortDir === 'desc' ? -result : result;
    });
  }, [filteredData, sortKey, sortDir, columns]);

  // ─── Pagination ───
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = showPagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length]);

  // ─── Export CSV ───
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headerRow = columns.map(c => `"${String(c.header).replace(/"/g, '""')}"`).join(',');
    const exportData = filteredData.map(row => {
      return columns.map(col => {
        const val = (row as any)[col.key] !== undefined ? (row as any)[col.key] : '';
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      }).join(',');
    });
    const csvContent = [headerRow, ...exportData].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ─── Sort handler ───
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
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 text-zinc-300" />;
    if (sortDir === 'asc') return <ChevronUp className="w-3 h-3 text-zinc-900" />;
    return <ChevronDown className="w-3 h-3 text-zinc-900" />;
  };

  // ─── Loading skeleton ───
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-3 flex gap-6">
          {columns.map((col) => (
            <div key={col.key} className="h-3 bg-zinc-100 rounded skeleton-shimmer" style={{ width: col.width || '100px' }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-5 py-3.5 flex gap-6 border-b border-zinc-50">
            {columns.map((col, colIdx) => (
              <div
                key={col.key}
                className="h-4 bg-zinc-50 rounded skeleton-shimmer"
                style={{
                  width: col.width || `${60 + (((i * 7) + colIdx * 11) % 80)}px`,
                  animationDelay: `${colIdx * 100}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
      {/* ─── Toolbar ─── */}
      {(showResultCount || searchable || exportable) && data.length > 0 && (
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap gap-3 items-center justify-between">
          {searchable ? (
            <div className="relative max-w-sm w-full md:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 text-[13px] text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/8 transition-all duration-150 bg-zinc-50/50 focus:bg-white"
              />
            </div>
          ) : <div />}

          <div className="flex items-center gap-3">
            {showResultCount && (
              <span className="text-[12px] text-zinc-400 font-medium whitespace-nowrap tabular-nums">
                {paginatedData.length === filteredData.length
                  ? `${filteredData.length} résultat${filteredData.length > 1 ? 's' : ''}`
                  : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredData.length)} sur ${filteredData.length}`
                }
              </span>
            )}

            {exportable && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-150 shadow-sm active:scale-[0.97]"
                title="Exporter au format CSV"
              >
                <Download className="w-3 h-3" />
                Exporter
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Table ─── */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead>
            <tr className="border-b border-zinc-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 whitespace-nowrap select-none
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.sortable ? 'cursor-pointer hover:text-zinc-600 transition-colors duration-150' : ''}
                  `}
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
          <tbody>
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
                  className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors duration-100 group"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-5 py-3 text-zinc-700
                        ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                      `}
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

      {/* ─── Pagination ─── */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100">
          <span className="text-[12px] text-zinc-400 tabular-nums">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
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
                  className={`w-7 h-7 text-[12px] font-medium rounded-md transition-all duration-150 ${
                    currentPage === pageNum
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
