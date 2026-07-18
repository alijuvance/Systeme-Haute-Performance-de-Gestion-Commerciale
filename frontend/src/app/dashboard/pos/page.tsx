'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import { ProductCatalog } from '@/features/pos/components/ProductCatalog';
import { CartSidebar } from '@/features/pos/components/CartSidebar';
import { useCart } from '@/features/pos/hooks/useCart';
import { checkoutSale } from '@/features/pos/api/posApi';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { Product, Depot } from '@/features/pos/types';
import { generateInvoicePdf } from '@/utils/pdfGenerator';

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [selectedDepot, setSelectedDepot] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, total } = useCart();

  useEffect(() => {
    const fetchInit = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [prodRes, depRes] = await Promise.all([
        fetch('/api/products', { headers }),
        fetch('/api/depots', { headers })
      ]);
      if (prodRes.ok) {
        const p = await prodRes.json();
        setProducts(p.data || p); // handle pagination wrapper
      }
      if (depRes.ok) {
        const d = await depRes.json();
        setDepots(d);
        if (d.length > 0) setSelectedDepot(d[0].id);
      }
    };
    fetchInit();
  }, []);

  useBarcodeScanner((barcode) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      toast.success(`${product.name} ajouté via scan`);
    } else {
      toast.error(`Produit avec code-barre ${barcode} introuvable.`);
    }
  });

  const handleCheckout = async () => {
    if (cart.length === 0) { toast.warning('Le panier est vide'); return; }
    if (!selectedDepot) { toast.warning('Veuillez sélectionner un dépôt source (Caisse)'); return; }

    setLoading(true);
    try {
      const sale = await checkoutSale(selectedDepot, cart);
      toast.success('Encaissement réussi !');
      const wantPDF = await toast.confirm({ title: 'Ticket de caisse', message: 'Voulez-vous générer le ticket de caisse (PDF) ?', variant: 'info', confirmText: 'Générer' });
      if (wantPDF) {
        generateInvoicePdf(sale);
      }
      clearCart();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'encaissement');
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
