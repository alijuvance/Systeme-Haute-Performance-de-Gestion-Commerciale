'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PurchasesPage() {
  const [orders, setOrders] = useState([]);
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Modal reception
  const [receivingOrder, setReceivingOrder] = useState<any>(null);
  const [selectedDepotId, setSelectedDepotId] = useState('');

  const fetchOrders = async () => {
    const res = await fetch('/api/purchase-orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  const fetchDepots = async () => {
    const res = await fetch('/api/depots', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) setDepots(await res.json());
  };

  useEffect(() => { 
    fetchOrders(); 
    fetchDepots();
  }, []);

  const handleReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivingOrder || !selectedDepotId) return;

    const res = await fetch(`/api/purchase-orders/${receivingOrder.id}/receive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ receivingDepotId: selectedDepotId })
    });

    if (res.ok) {
      setReceivingOrder(null);
      fetchOrders();
    } else {
      alert('Erreur lors de la réception');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bons de Commande (Achats)</h1>
        <Link href="/dashboard/purchases/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          + Nouvelle Commande
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant (MGA)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <tr><td colSpan={6} className="p-4 text-center">Chargement...</td></tr> : 
             orders.map((o: any) => (
              <tr key={o.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{o.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(o.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{o.supplier?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(o.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${o.status === 'RECEIVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {o.status !== 'RECEIVED' && (
                    <button onClick={() => setReceivingOrder(o)} className="text-indigo-600 hover:text-indigo-900">
                      Réceptionner
                    </button>
                  )}
                  {o.status === 'RECEIVED' && o.receivingDepot && (
                    <span className="text-gray-500 text-xs">Injecté dans {o.receivingDepot.name}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {receivingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Réceptionner la commande {receivingOrder.orderNumber}</h2>
            <p className="text-sm text-gray-600 mb-4">Dans quel dépôt souhaitez-vous injecter la marchandise ?</p>
            <form onSubmit={handleReceive}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Dépôt de destination</label>
                  <select required value={selectedDepotId} onChange={e => setSelectedDepotId(e.target.value)} className="mt-1 w-full border rounded p-2">
                    <option value="">Sélectionner un dépôt</option>
                    {depots.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setReceivingOrder(null)} className="px-4 py-2 border rounded text-gray-600">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Confirmer l'entrée en stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
