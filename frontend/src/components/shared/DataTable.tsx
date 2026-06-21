import React from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  isLoading,
  emptyMessage = "Aucune donnée trouvée."
}: DataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-200">
        <div className="p-8 flex justify-center text-slate-500">
          Chargement en cours...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-4 py-3 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-50 transition-colors group">
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-4 py-3 text-slate-700 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
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
  );
}
