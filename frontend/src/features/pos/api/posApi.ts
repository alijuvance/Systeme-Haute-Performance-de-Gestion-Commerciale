export const checkoutSale = async (selectedDepot: string, cart: any[]) => {
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
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Stock insuffisant ou problème serveur');
  }
  return res.json();
};
