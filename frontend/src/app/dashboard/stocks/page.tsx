import { AlertTriangle, PackageSearch, ArrowRightLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function StocksDashboard() {
  const stockItems = [
    { id: 1, product: "Lait Entier 1L", depot: "Dépôt Central", quantity: 1500, minAlert: 500, status: "OK" },
    { id: 2, product: "Café Moulu 250g", depot: "Épicerie Principale", quantity: 15, minAlert: 50, status: "RUPTURE" },
    { id: 3, product: "Sucre en poudre 1kg", depot: "Dépôt Central", quantity: 80, minAlert: 100, status: "WARNING" },
    { id: 4, product: "Farine T55 1kg", depot: "Dépôt Secondaire", quantity: 450, minAlert: 200, status: "OK" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">État des Stocks</h1>
          <p className="text-gray-500">Supervision multi-dépôts en temps réel.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/dashboard/stocks/transfers" 
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium text-sm text-gray-700 dark:text-gray-200"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Transferts (Transit)
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all font-medium text-sm">
            <PackageSearch className="w-4 h-4" />
            Nouveau Mouvement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><PackageSearch className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Total Références</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1,245</p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><AlertTriangle className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Seuil d'Alerte</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500"><ShieldAlert className="w-24 h-24" /></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><ShieldAlert className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Ruptures de Stock</h3>
          </div>
          <p className="text-3xl font-bold text-red-500 relative z-10">7</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Inventaire Détaillé</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Produit</th>
                <th className="px-6 py-4 font-medium">Dépôt</th>
                <th className="px-6 py-4 font-medium text-right">Quantité</th>
                <th className="px-6 py-4 font-medium text-right">Seuil Alerte</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900 dark:text-white">{item.product}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {item.depot}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-500 dark:text-gray-400">
                    {item.minAlert}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'OK' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">En Stock</span>}
                    {item.status === 'WARNING' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400">Alerte</span>}
                    {item.status === 'RUPTURE' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 animate-pulse"><AlertTriangle className="w-3 h-3"/> Rupture</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
