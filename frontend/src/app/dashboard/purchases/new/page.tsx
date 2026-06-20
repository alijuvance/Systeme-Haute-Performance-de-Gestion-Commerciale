'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPurchaseOrderPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const [supplierId, setSupplierId] = useState('');
  const [lines, setLines] = useState([{ productId: '', quantity: 1, unitPrice: 0 }]);

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [suppRes, prodRes] = await Promise.all([
        fetch('/api/suppliers', { headers }),
        fetch('/api/products', { headers })
      ]);
      if (suppRes.ok) setSuppliers(await suppRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    };
    fetchData();
  }, []);

  const addLine = () => setLines([...lines, { productId: '', quantity: 1, unitPrice: 0 }]);
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: string, value: any) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [field]: value };
    setLines(newLines);
  };

  const totalAmount = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || lines.some(l => !l.productId || l.quantity <= 0)) {
      return alert("Veuillez remplir correctement la commande.");
    }

    const res = await fetch('/api/purchase-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ supplierId, lines })
    });

    if (res.ok) {
      router.push('/dashboard/purchases');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau Bon de Commande</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
          <div>
            <label className="block text-sm font-medium">Fournisseur *</label>
            <select required value={supplierId} onChange={e => setSupplierId(e.target.value)} className="mt-1 w-full border rounded p-2">
              <option value="">Sélectionner un fournisseur...</option>
              {suppliers.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lignes de commande</h2>
            <button type="button" onClick={addLine} className="text-blue-600 text-sm font-medium">+ Ajouter une ligne</button>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mb-4">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Produit</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2 w-24">Quantité</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2 w-40">Prix Unitaire (MGA)</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2 w-32">Total Ligne</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lines.map((line, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2">
                    <select required value={line.productId} onChange={e => updateLine(idx, 'productId', e.target.value)} className="w-full border rounded p-2 text-sm">
                      <option value="">Choisir...</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', Number(e.target.value))} className="w-full border rounded p-2 text-sm" />
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" min="0" value={line.unitPrice} onChange={e => updateLine(idx, 'unitPrice', Number(e.target.value))} className="w-full border rounded p-2 text-sm" />
                  </td>
                  <td className="py-2 font-medium text-gray-900 text-sm">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(line.quantity * line.unitPrice)}
                  </td>
                  <td className="py-2 text-right">
                    {lines.length > 1 && (
                      <button type="button" onClick={() => removeLine(idx)} className="text-red-500 text-xl font-bold">&times;</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-4 border-t">
            <div className="text-xl font-bold">
              Total : {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(totalAmount)}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.push('/dashboard/purchases')} className="px-6 py-2 border rounded text-gray-700 bg-white">Annuler</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium">Valider la Commande</button>
        </div>
      </form>
    </div>
  );
}
