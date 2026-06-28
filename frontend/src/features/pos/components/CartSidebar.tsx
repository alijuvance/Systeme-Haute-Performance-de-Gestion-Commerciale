import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  cart: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  total: number;
  handleCheckout: () => void;
  loading: boolean;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  total,
  handleCheckout,
  loading
}) => {
  return (
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
                  <button onClick={() => updateQuantity(item.product.id, -1)} className="text-gray-500 hover:text-black">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="text-gray-500 hover:text-black">
                    <Plus className="w-4 h-4" />
                  </button>
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
  );
};
