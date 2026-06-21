const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const featuresDir = path.join(srcDir, 'features');
const appDir = path.join(srcDir, 'app', 'dashboard');

const modules = [
  { name: 'products', title: 'Produits', singleName: 'Product', icon: 'Package' },
  { name: 'customers', title: 'Clients', singleName: 'Customer', icon: 'Users' },
  { name: 'suppliers', title: 'Fournisseurs', singleName: 'Supplier', icon: 'Truck' },
  { name: 'purchases', title: 'Achats', singleName: 'Purchase', icon: 'ShoppingCart' },
  { name: 'stocks', title: 'Stocks', singleName: 'Stock', icon: 'Layers' },
];

modules.forEach(m => {
  // Create Feature Folders
  const featDir = path.join(featuresDir, m.name);
  ['api', 'components', 'hooks', 'schemas', 'types'].forEach(d => {
    fs.mkdirSync(path.join(featDir, d), { recursive: true });
  });

  // Create API
  const apiCode = `import api from '@/api/axios';

export const get${m.name.charAt(0).toUpperCase() + m.name.slice(1)} = async (): Promise<any[]> => {
  const response = await api.get('/api/${m.name}');
  return response.data;
};
`;
  fs.writeFileSync(path.join(featDir, 'api', `get${m.name.charAt(0).toUpperCase() + m.name.slice(1)}.ts`), apiCode);

  // Create Hook
  const hookName = `use${m.name.charAt(0).toUpperCase() + m.name.slice(1)}`;
  const hookCode = `import { useState, useEffect } from 'react';
import { get${m.name.charAt(0).toUpperCase() + m.name.slice(1)} } from '../api/get${m.name.charAt(0).toUpperCase() + m.name.slice(1)}';

export const ${hookName} = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await get${m.name.charAt(0).toUpperCase() + m.name.slice(1)}();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, error };
};
`;
  fs.writeFileSync(path.join(featDir, 'hooks', `${hookName}.ts`), hookCode);

  // Create Component
  const compName = `${m.name.charAt(0).toUpperCase() + m.name.slice(1)}Table`;
  const compCode = `import React from 'react';

interface ${compName}Props {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export const ${compName}: React.FC<${compName}Props> = ({ data, isLoading, error }) => {
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (isLoading) return <div className="p-4 animate-pulse">Chargement des ${m.title.toLowerCase()}...</div>;

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
`;
  fs.writeFileSync(path.join(featDir, 'components', `${compName}.tsx`), compCode);

  // Create Page in app/dashboard/
  const pageDir = path.join(appDir, m.name);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  
  const pageCode = `'use client';
import { ${hookName} } from '@/features/${m.name}/hooks/${hookName}';
import { ${compName} } from '@/features/${m.name}/components/${compName}';
import { Plus } from 'lucide-react';

export default function ${m.singleName}Page() {
  const { data, isLoading, error } = ${hookName}();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des ${m.title}</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouveau
        </button>
      </div>

      <${compName} data={data} isLoading={isLoading} error={error} />
    </div>
  );
}
`;
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageCode);
});

console.log('Modules refactored successfully.');
