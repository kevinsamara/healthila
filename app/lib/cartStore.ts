// Cart Store — simpan di localStorage browser

export type CartItem = {
  id: string;
  produkId: number;
  nama: string;
  varian: string | null;
  harga: number;
  hargaLabel: string;
  qty: number;
  foto: string;
  icon: string;
};

const CART_KEY = 'healthila_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, 'id'>): CartItem[] {
  const cart = getCart();
  const key = `${item.produkId}-${item.varian || 'default'}`;
  const existing = cart.find(c => c.id === key);
  if (existing) {
    existing.qty += item.qty;
    saveCart(cart);
    return cart;
  }
  const newCart = [...cart, { ...item, id: key }];
  saveCart(newCart);
  return newCart;
}

export function updateQty(id: string, qty: number): CartItem[] {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (item) item.qty = Math.max(1, qty);
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string): CartItem[] {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.harga * item.qty, 0);
}