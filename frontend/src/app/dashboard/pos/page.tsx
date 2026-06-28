'use client';
import { useState, useEffect } from 'react';
import { ProductCatalog } from '@/features/pos/components/ProductCatalog';
import { CartSidebar } from '@/features/pos/components/CartSidebar';
import { useCart } from '@/features/pos/hooks/useCart';
import { checkoutSale } from '@/features/pos/api/posApi';
import { Product, Depot } from '@/features/pos/types';

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [selectedDepot, setSelectedDepot] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, total } = useCart();

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

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Le panier est vide');
    if (!selectedDepot) return alert('Veuillez sélectionner un dépôt source (Caisse)');

    setLoading(true);
    try {
      await checkoutSale(selectedDepot, cart);
      alert('Encaissement réussi !');
      clearCart();
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      <ProductCatalog 
        products={products}
        depots={depots}
        selectedDepot={selectedDepot}
        setSelectedDepot={setSelectedDepot}
        addToCart={addToCart}
      />
      
      <CartSidebar 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={total}
        handleCheckout={handleCheckout}
        loading={loading}
      />
    </div>
  );
}
