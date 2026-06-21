import React from 'react';

interface SuppliersTableProps {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export const SuppliersTable: React.FC<SuppliersTableProps> = ({ data, isLoading, error }) => {
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (isLoading) return <div className="p-4 animate-pulse">Chargement des fournisseurs...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom / Réf</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.length === 0 ? <tr><td colSpan={3} className="text-center p-4 text-gray-500">Aucune donnée trouvée.</td></tr> :
            data.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">{item.id || '#'}</td>
                <td className="px-6 py-4">{item.name || item.reference || 'N/A'}</td>
                <td className="px-6 py-4">{item.status || 'Actif'}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
