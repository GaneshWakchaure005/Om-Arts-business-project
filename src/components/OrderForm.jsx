import { useState} from 'react';
import { Check, Loader } from 'lucide-react';
import Downloadbtn from './Downloadbtn';
// const Downloadbtn = lazy(()=> import('./Downloadbtn'));

const OrderForm = ({ onSubmit, onDownload, isSubmitted }) => {

    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 py-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-500 mb-2">
                    <Check size={32} />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Order Submitted!</h3>
                    <p className="text-stone-600 dark:text-gray-400 max-w-xs mx-auto">
                        Thank you for your order. Please download your order invoice below and send us on whatsapp. Then we will contact you.
                    </p>
                </div>

                    <Downloadbtn onDownload={onDownload}/>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your phone number"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
                    Delivery Address
                </label>
                <textarea
                    name="address"
                    required
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter complete address"
                />
            </div>

            <button
                type="submit"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                Submit Order
            </button>
        </form>
    );
};
export default OrderForm;