'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSlideOver({ open, onClose }: Props) {
  const { items, subtotal, add, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-stone-900/30 backdrop-blur-sm"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.aside
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] border-l border-stone-200 shadow-2xl flex flex-col"
          >
            <header className="flex items-center justify-between px-6 h-16 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-stone-700" strokeWidth={1.5} />
                <span className="font-serif text-lg text-stone-900">Your quiet cart</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-stone-500" strokeWidth={1.5} />
                  </div>
                  <p className="font-serif text-lg text-stone-900 mb-1">
                    Nothing here yet
                  </p>
                  <p className="text-sm text-stone-500 max-w-[24ch]">
                    Add a ritual or two. They will wait for you here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-200/80"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-[15px] text-stone-900 leading-tight">
                          {it.name}
                        </h3>
                        <p className="text-[12px] text-stone-500 mt-1 leading-relaxed">
                          {it.note}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 bg-stone-100 rounded-full p-0.5">
                            <button
                              type="button"
                              onClick={() => remove(it.id)}
                              aria-label="Decrease"
                              className="w-7 h-7 rounded-full hover:bg-white text-stone-700 inline-flex items-center justify-center"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-[13px] text-stone-900 tabular-nums">
                              {it.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                add({
                                  id: it.id,
                                  name: it.name,
                                  note: it.note,
                                  price: it.price,
                                })
                              }
                              aria-label="Increase"
                              className="w-7 h-7 rounded-full hover:bg-white text-stone-700 inline-flex items-center justify-center"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[13px] text-stone-700 tabular-nums">
                            ${(it.price * it.qty).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-stone-200 px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span className="text-stone-900 tabular-nums">${subtotal.toFixed(0)}</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Shipping & taxes calculated at checkout. Rituals ship in unbleached paper.
              </p>
              <button
                type="button"
                disabled={items.length === 0}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-stone-900 text-[#FDFBF7] text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}