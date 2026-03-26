import { useState, useEffect, lazy, Suspense } from 'react';
const CartSidebar = lazy(()=> import('./CartSidebar'));
import { Size1data, Size2data, Size3data, Size4data } from '../data/data';
import { Loader, Mail, MapPin, Phone, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import Sizebtn from './Sizebtn';
import Footer from './Footer';
import Header from './Header';
import OrderForm from './OrderForm'
import OrderSummaryTemplate from './OrderSummaryTemplate';
import { createRoot } from "react-dom/client";
import { flushSync } from 'react-dom';

const BUSINESS_ADDRESS = {
  shop: "ओम आर्ट्स - गणपती मूर्ती कार्यशाळा ",
  street: "कोल्हार भागवतीनगर,सोनगाव रोड, तालुका:राहता , जिल्हा:अहिल्यानगर",

  city: "कोल्हार, महाराष्ट्र ",
  pin: "413710",
  phone: "+91 9822397846 , +91 8010072112",
  email: "ganeshwakchaure801@gmail.com"
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-600/30 w-full max-w-lg rounded-2xl shadow-2xl shadow-stone-400/20 dark:shadow-none overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:text-gray-400 dark:hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="p-8">
          {title && <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4 marathi-sans">{title}</h3>}
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function Main() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSize, setActiveSize] = useState(1);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);


  useEffect(() => {
    if (isAddressOpen || isOrderFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAddressOpen, isOrderFormOpen]);

  const addToCart = (product, qty) => {
    setCart(prev => {
      let updatedCart;

      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        updatedCart = prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        updatedCart = [...prev, { ...product, qty }];
      }

      return updatedCart.sort((a, b) => a.id - b.id);
    });
  };


  const updateItemQty = (id, newQty) => {
    if (newQty < 1) return removeItem(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleOrderClick = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
    setIsOrderSubmitted(false);
  };

  const handleOrderSubmit = (details) => {
    setOrderDetails(details);
    setIsOrderSubmitted(true);
  };


 const generatePDF = async () => {

  if (!window.html2pdf) {
    console.error("html2pdf CDN not loaded");
    return;
  }

  // 1️⃣ Create hidden container
  const container = document.createElement("div");

  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // A4 width in px
  container.style.background = "#ffffff";

  document.body.appendChild(container);

  const root = createRoot(container);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 2️⃣ Render template
  flushSync(() => {
    root.render(
      <Suspense fallback={<Loader/>}>
        <OrderSummaryTemplate
        cart={cart}
        orderDetails={orderDetails}
        total={total}
      />
      </Suspense>
    );
  });

  // 3️⃣ Wait for DOM to fully render
  await new Promise(resolve => setTimeout(resolve, 200));

  try {

    const element = container.firstElementChild;

    const opt = {
      margin: [10, 0, 10, 0],
      filename: `${orderDetails?.name || "order"}-Order.pdf`,
      image: { type: "jpeg", quality: 0.98 },

      html2canvas: {
        scale: 1.3,
        useCORS: true,
        scrollY: 0
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },

      pagebreak: {
        mode: ["css", "legacy"]
      }
    };

    // 4️⃣ Generate PDF
    await window.html2pdf()
      .set(opt)
      .from(element)
      .toCanvas()
      .toPdf()
      .save()

  } catch (err) {
    console.error("PDF generation failed:", err);
  } finally {

    // 5️⃣ Cleanup
    root.unmount();
    document.body.removeChild(container);

  }
};





  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 font-sans text-stone-800 dark:text-slate-200 selection:bg-amber-500/30 ">

      {/* Header */}
      <Header cart={cart} setIsAddressOpen={setIsAddressOpen} setIsCartOpen={setIsCartOpen} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      <div className='bg-white dark:bg-slate-900 dark:text-white text-md  font-bold sans text-black overflow-hidden'>
        <h3 className="animate-scroll [animation-duration:12s] md:[animation-duration:35s] py-4 mt-20 md:mt-23 text-nowrap">
          2026 साठी बूकिंग सुरू झाली आहे !
        </h3>

      </div>
      {/* --- Hero Section --- */}
      <div className="relative bg-white dark:bg-slate-900  pb-10 lg:pb-15">

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
          >

            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 border border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-500 text-sm font-semibold mb-6 tracking-wider uppercase">
              || वक्रतुंड महाकाय सूर्यकोटि समप्रभ निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||
            </span>
            <h3 className="text-5xl md:text-7xl marathi-yatra font-bold text-stone-900 dark:text-white leading-tight mb-6">
              सर्व प्रकारच्या गणपती मूर्ती <br />

            </h3>
            <h2 className="mt-4 max-w-2xl text-xl text-stone-600 dark:text-gray-400 mx-auto mb-10">
              पीओपी व शाडू मातीच्या गणेश मूर्ती बनविण्यात अग्रगण्य. सुंदर, आकर्षक आणि पर्यावरणपूरक गणेश मूर्ती योग्य किमतीत उपलब्ध.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#collection"
                className="px-8 py-4 bg-blue-500 hover:bg-black dark:hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-1"
              >
                सर्व मॉडेल्स बघा
              </a>
              <button
                onClick={() => setIsAddressOpen(true)}
                className="px-8 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-white rounded-xl font-bold text-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm"
              >
                <MapPin size={20} /> आमचा  पत्ता
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- Stat Banner --- */}
      <div className="bg-stone-100/80 border-y border-stone-200 dark:bg-slate-900/50 dark:border-white/5 backdrop-blur-sm">
        <div className="w-full h-20 flex justify-center items-center text-center p-4 text-stone-800 dark:text-white font-medium">
          आपल्याकडील विविध प्रकारच्या मूर्ती खालील प्रमाणे आहेत. आजच आपली ऑर्डर पूर्ण करा !
        </div>
      </div>

      {/* --- Product Collection --- */}
      <div id="collection" className="py-10 bg-stone-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white mb-4">आमच्याकडील विविध मूर्ती </h3>
            <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full" />
            <p className="mt-4 text-stone-600 dark:text-gray-400">आपली ऑर्डर ऑनलाइन स्वीकारली जाईल </p>
          </div>
          {/* sizes section */}
          <div className="flex w-full justify-evenly mb-8 items-center">
            <Sizebtn id={1} label="6/9 इंच " activeSize={activeSize} setActiveSize={setActiveSize} />
            <Sizebtn id={2} label="1 फुट" activeSize={activeSize} setActiveSize={setActiveSize} />
            <Sizebtn id={3} label="1.25 / 1.5 फुट " activeSize={activeSize} setActiveSize={setActiveSize} />
            <Sizebtn id={4} label="2 फुट+" activeSize={activeSize} setActiveSize={setActiveSize} />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeSize == 1 && Size1data.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
            {activeSize === 2 && Size2data.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
            {activeSize === 3 && Size3data.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
            {activeSize === 4 && Size4data.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* sizes section */}
      <div className="flex w-full justify-evenly mb-8 items-center font-bold">
        <a href="#collection"><Sizebtn id={1} label="6/9 इंच " activeSize={activeSize} setActiveSize={setActiveSize} /></a>
        <a href="#collection"><Sizebtn id={2} label="1 फुट" activeSize={activeSize} setActiveSize={setActiveSize} /></a>
        <a href="#collection"><Sizebtn id={3} label="1.25 / 1.5 फुट " activeSize={activeSize} setActiveSize={setActiveSize} /></a>
        <a href="#collection"><Sizebtn id={4} label="2 फुट+" activeSize={activeSize} setActiveSize={setActiveSize} /></a>
      </div>

      <Footer />
      {/* address modals and others */}
      {/* Address Modal here */}
      <Modal isOpen={isAddressOpen} onClose={() => setIsAddressOpen(false)} title="आमच्या कार्यशाळेला भेट द्या ">
        <div className="space-y-4 text-stone-600 dark:text-gray-300 font-light">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-stone-100 dark:bg-slate-800 p-2 rounded-lg text-amber-600 dark:text-amber-500">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-stone-900 dark:text-white font-semibold text-lg">{BUSINESS_ADDRESS.shop}</h3>
              <p className="mt-1">{BUSINESS_ADDRESS.street}</p>
              <p>{BUSINESS_ADDRESS.city} - {BUSINESS_ADDRESS.pin}</p>
            </div>
          </div>

          <div className="h-px bg-stone-200 dark:bg-white/10 w-full my-2" />

          <div className="flex items-center gap-4">
            <Phone size={20} className="text-amber-600 dark:text-amber-500" />
            <span className="text-stone-900 dark:text-white">{BUSINESS_ADDRESS.phone}</span>
          </div>
          <div className="flex items-center gap-4">
            <Mail size={20} className="text-amber-600 dark:text-amber-500" />
            <span className="text-stone-900 dark:text-white">{BUSINESS_ADDRESS.email}</span>
          </div>
        </div>
      </Modal>
      {/* Cart Sidebar */}
      <Suspense fallback={<Loader/>}>
        <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        updateItemQty={updateItemQty}
        removeItem={removeItem}
        onOrderClick={handleOrderClick}
      />
      </Suspense>

      {/* Order Form Modal */}
      <Modal

        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        title={isOrderSubmitted ? "Order Confirmation" : "Complete Your Order"}
      >
        <Suspense fallback={<Loader/>}>
          <OrderForm
          onSubmit={handleOrderSubmit}
          isSubmitted={isOrderSubmitted}
          onDownload={generatePDF}
        />
        </Suspense>
      </Modal>
    </div>
  );
}

