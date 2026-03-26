import { Truck, X, Plus, Minus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = ({ isOpen, onClose, cartItems, updateItemQty, removeItem, onOrderClick }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm z-50"
          />
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-150 bg-stone-50 dark:bg-slate-900 border-l border-stone-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-amber-600 dark:text-amber-500 font-serif flex items-center gap-2">
                <Truck size={38} /> Your Orders
              </h2>
              <button onClick={onClose} className="text-stone-500 hover:text-stone-800 dark:text-gray-400 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-500 dark:text-gray-500 space-y-4">
                  <Truck size={48} strokeWidth={1} className="text-stone-400 dark:text-gray-600" />
                  <p className="text-center">Your cart is empty. <br />Order some divine blessings!</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <motion.div
                    layout
                    key={item.id}
                    className="bg-white dark:bg-slate-800/50 rounded-xl flex flex-col  border border-stone-200 dark:border-slate-700/50 shadow-sm dark:shadow-none"
                  >
                    <div className='flex gap-6 p-3'>
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-stone-900 dark:text-white font-semibold text-sm mb-1">{item.name}</h4>
                        <p className="text-amber-600 dark:text-amber-500 font-bold">₹{item.price} / unit</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-stone-100 dark:bg-slate-800 rounded border border-stone-300 dark:border-slate-600">
                            <button
                              onClick={() => updateItemQty(item.id, item.qty - 1)}
                              className="px-2 py-1 text-stone-600 hover:text-stone-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-mono text-stone-900 dark:text-white px-2">{item.qty}</span>
                            <button
                              onClick={() => updateItemQty(item.id, item.qty + 1)}
                              className="px-2 py-1 text-stone-600 hover:text-stone-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 border border-gray-500/30 rounded-xl px-2 pb-1 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline">Remove</button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end py-1">
                        <span className="text-stone-900 dark:text-white font-bold">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                    <div className='bg-blue-400 text-center rounded-b-xl font-semibold dark:bg-blue-700'>
                      {item.qty} Unit Ordered
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 bg-white dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-500 dark:text-gray-400">Total Amount</span>
                  <span className="text-2xl font-bold text-stone-900 dark:text-white">₹{total}</span>
                </div>
                <button
                  onClick={onOrderClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 dark:shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Check size={18} /> Confirm Order
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartSidebar;