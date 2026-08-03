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
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedDepot, setSelectedDepot] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const { cart, addToCart, updateQuantity, setQuantity, removeFromCart, clearCart, total } = useCart();

  useEffect(() => {
    const fetchInit = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [prodRes, depRes, custRes] = await Promise.all([
        fetch('/api/products?limit=1000', { headers }),
        fetch('/api/depots', { headers }),
        fetch('/api/customers?limit=1000', { headers })
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
      if (custRes.ok) {
        const c = await custRes.json();
        setCustomers(c.data || c);
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
      const sale = await checkoutSale(selectedDepot, cart, selectedCustomer);
      toast.success('Encaissement réussi !');
      const wantPDF = await toast.confirm({ title: 'Ticket de caisse', message: 'Voulez-vous générer le ticket de caisse (PDF) ?', variant: 'info', confirmText: 'Générer' });
      if (wantPDF) {
        generateInvoicePdf(sale);
      }
      clearCart();
      setSelectedCustomer('');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'encaissement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input other than the pos-search (except F keys which we want to override)
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('pos-search')?.focus();
      } else if (e.key === 'F8') {
        e.preventDefault();
        handleCheckout();
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) {
          const ok = window.confirm("Voulez-vous vraiment vider le panier actuel ?");
          if (ok) clearCart();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, selectedDepot, selectedCustomer]);

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
        setQuantity={setQuantity}
        removeFromCart={removeFromCart}
        total={total}
        handleCheckout={handleCheckout}
        loading={loading}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
    </div>
  );
}
