
import { useState, useEffect,lazy,Suspense } from 'react';
import { Loader, Minus, Plus, Truck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import StatusButton from './StatusButton';
const StatusButton = lazy(()=> import('./StatusButton'));

export const ProductCard = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const [showImage, setShowImage] = useState(false);
  const [OrderedAlready, setIsOrderedAlready] = useState(false);

  useEffect(() => {
  if (showImage) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showImage]);


  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03, y: -6 }}
        transition={{
          duration: 0.1,
          ease: "ease"
        }}
        className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-700   transition-transform duration-200 shadow-2xl"
      >
        <div className="relative h-90 overflow-hidden cursor-pointer">
          <img
            src={product.image}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onClick={() => setShowImage(true)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 dark:opacity-100 pointer-events-none" />
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-white text-stone-900 dark:text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            {product.size}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1 block">{product.category}</span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-stone-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 font-bold md:text-xl">{product.name}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-stone-900 dark:text-white">₹{product.price}</span>

            {/* Integrated Quantity Selector */}
            <div className='flex gap-2 items-center '>
              <p className='text-md font-sans font-semibold pb-1'>Select Qty</p>
              <div className="flex items-center bg-stone-100 dark:bg-slate-700 rounded-lg p-1 border border-stone-300 dark:border-slate-600">
                <button

                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-600 rounded transition-colors"
                >
                  <Minus size={18} />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-10 bg-transparent text-center text-stone-900 dark:text-white font-semibold text-sm outline-none hide-spinners"
                />
                <button
                  onClick={() => setQty(prev => prev + 1)}
                  disabled={qty == product.maxlimit}
                  className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-600 rounded transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Suspense fallback={<Loader/>}>
              <StatusButton OrderedAlready={OrderedAlready} qty={qty} product={product} addToCart={onAddToCart} setIsAlreadyOrdered={setIsOrderedAlready} />
            </Suspense>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {showImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-stone-900/90 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

          >
            {/* close button */}
            <div className='relative'>
              <button
                onClick={() => setShowImage(false)}
                className="absolute top-2 md:top-4 right-2 md:right-4  bg-black/70 p-2 rounded-full backdrop-blur-sm transition-colors text-white"
              >
                <X size={24} />
              </button>

              {/* image */}
              <motion.img
                src={product.image}
                alt={product.name}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
