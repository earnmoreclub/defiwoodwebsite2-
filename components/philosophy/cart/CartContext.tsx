'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number; // in cents
  description?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartApi = CartState & {
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], isOpen: false });

  const add = useCallback((item: CartItem) => {
    setState((s) => ({
      ...s,
      isOpen: true,
      items: s.items.find((i) => i.id === item.id) ? s.items : [...s.items, item],
    }));
  }, []);

  const remove = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
  }, []);

  const clear = useCallback(() => setState((s) => ({ ...s, items: [] })), []);
  const openDrawer = useCallback(() => setState((s) => ({ ...s, isOpen: true })), []);
  const closeDrawer = useCallback(() => setState((s) => ({ ...s, isOpen: false })), []);

  const api = useMemo<CartApi>(() => {
    const itemCount = state.items.length;
    const subtotal = state.items.reduce((sum, i) => sum + i.price, 0);
    return {
      ...state,
      add,
      remove,
      clear,
      openDrawer,
      closeDrawer,
      itemCount,
      subtotal,
    };
  }, [state, add, remove, clear, openDrawer, closeDrawer]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
