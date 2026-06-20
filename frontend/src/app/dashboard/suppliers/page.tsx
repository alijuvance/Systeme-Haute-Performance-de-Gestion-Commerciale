'use client';
import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', contactName: '', email: '', phone: '', address: '', taxId: '' });

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setSuppliers(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newSupplier)
    });
    setIsModalOpen(false);
    fetchSuppliers();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Annuaire des Fournisseurs</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          + Nouveau Fournisseur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <tr><td colSpan={4} className="p-4 text-center">Chargement...</td></tr> : 
             suppliers.map((s: any) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.contactName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouveau Fournisseur</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium">Nom de l'entreprise *</label>
                <input required type="text" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
                
                <div><label className="block text-sm font-medium">Nom du contact</label>
                <input type="text" value={newSupplier.contactName} onChange={e => setNewSupplier({...newSupplier, contactName: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
                
                <div><label className="block text-sm font-medium">Email</label>
                <input type="email" value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
                
                <div><label className="block text-sm font-medium">Téléphone</label>
                <input type="text" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
