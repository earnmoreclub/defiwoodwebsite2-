'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { isOpen, closeDrawer, items, remove, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream-50 shadow-xl border-l border-charcoal/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-charcoal/60" />
                <span className="font-serif text-lg text-charcoal">Your selection</span>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-cream-100 text-charcoal/50 hover:text-charcoal transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-charcoal/10 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-charcoal/30" />
                  </div>
                  <p className="text-sm text-charcoal/50">
                    Nothing here yet.
                    <br />
                    Find a ritual to begin.
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-charcoal">{item.name}</div>
                        {item.description && (
                          <p className="mt-1 text-xs text-charcoal/50 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-1 text-sm text-sage font-medium">
                          ${(item.price / 100).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="flex-shrink-0 p-1.5 rounded-full text-charcoal/30 hover:text-charcoal hover:bg-cream-100 transition-colors"
                        aria-label="Remove item"
                      >
                        <Minus size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-charcoal/10 px-6 py-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Subtotal</span>
                  <span className="font-medium text-charcoal">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <button className="w-full py-3.5 rounded-full bg-charcoal text-cream-50 text-xs uppercase tracking-editorial hover:bg-sage-700 transition-colors">
                  Proceed to checkout
                </button>
                <p className="text-center text-[10px] text-charcoal/40 uppercase tracking-editorial">
                  Taxes & shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
