import { CheckCircle2, Clock, Truck, Search, ArrowRightLeft } from "lucide-react";

export default function TransfersPage() {
  const transfers = [
    { id: "TR-2026-001", product: "Lait Entier 1L", qty: 200, from: "Dépôt Central", to: "Épicerie Principale", status: "IN_TRANSIT", date: "Il y a 2h" },
    { id: "TR-2026-002", product: "Café Moulu 250g", qty: 50, from: "Dépôt Central", to: "Épicerie Principale", status: "COMPLETED", date: "Hier" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transferts Inter-Dépôts</h1>
          <p className="text-gray-500">Gestion des expéditions et réceptions entre vos locaux.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all font-medium text-sm">
          <Truck className="w-4 h-4" />
          Nouveau Transfert
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher par référence, produit..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Référence</th>
                <th className="px-6 py-4 font-medium">Produit</th>
                <th className="px-6 py-4 font-medium">Trajet</th>
                <th className="px-6 py-4 font-medium text-right">Quantité</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {transfers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{t.id}</span>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {t.product}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-gray-600 dark:text-gray-300">{t.from}</span>
                      <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-gray-600 dark:text-gray-300">{t.to}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-gray-900 dark:text-white">
                    {t.qty}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {t.status === 'IN_TRANSIT' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">
                        <Clock className="w-3.5 h-3.5" /> En Transit
                      </span>
                    )}
                    {t.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Réceptionné
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {t.status === 'IN_TRANSIT' ? (
                      <button className="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
                        Réceptionner
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Traité</span>
                    )}
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
