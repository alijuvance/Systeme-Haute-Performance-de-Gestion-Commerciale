'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [depots, setDepots] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedDepot, setSelectedDepot] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [prodRes, depRes] = await Promise.all([
        fetch('/api/products', { headers }),
        fetch('/api/depots', { headers })
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (depRes.ok) {
        const d = await depRes.json();
        setDepots(d);
        if (d.length > 0) setSelectedDepot(d[0].id);
      }
    };
    fetchInit();
  }, []);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1, unitPrice: product.defaultPrice }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Le panier est vide');
    if (!selectedDepot) return alert('Veuillez sélectionner un dépôt source (Caisse)');

    setLoading(true);
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        type: 'POS',
        depotId: selectedDepot,
        lines: cart.map(c => ({
          productId: c.product.id,
          quantity: c.quantity,
          unitPrice: c.unitPrice
        }))
      })
    });

    setLoading(false);
    if (res.ok) {
      alert('Encaissement réussi !');
      setCart([]);
    } else {
      const err = await res.json();
      alert(`Erreur: ${err.message || 'Stock insuffisant ou problème serveur'}`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      {/* Catalogue */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Caisse (Point of Sale)</h1>
          <select value={selectedDepot} onChange={e => setSelectedDepot(e.target.value)} className="border rounded-lg p-2 font-medium">
            <option value="">Choisir la Caisse (Dépôt)</option>
            {depots.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p: any) => (
            <div key={p.id} onClick={() => addToCart(p)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition hover:border-blue-300">
              <div className="h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                Pas d'image
              </div>
              <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm">{p.name}</h3>
              <p className="text-blue-600 font-bold mt-2">
                {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(p.defaultPrice)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket / Panier */}
      <div className="w-96 bg-white border-l shadow-xl flex flex-col z-10">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Ticket de caisse
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Panier vide</div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-medium text-sm">
                  <span className="truncate pr-2">{item.product.name}</span>
                  <span>{new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(item.unitPrice * item.quantity)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3 bg-white border rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="text-gray-500 hover:text-black"><Minus className="w-4 h-4" /></button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="text-gray-500 hover:text-black"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center mb-4 text-xl font-bold">
            <span>Total</span>
            <span className="text-blue-600">{new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(total)}</span>
          </div>
          <button 
            disabled={loading || cart.length === 0} 
            onClick={handleCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? 'Encaissement...' : 'ENCAISSER'}
          </button>
        </div>
      </div>
    </div>
  );
}
