import React from 'react';
import invoicelogo from '../assets/invoicelogo.jpeg'
const OrderSummaryTemplate = React.forwardRef(({ cart, orderDetails, total }, ref) => {
    return (
        <div ref={ref} className="px-6 pb-6 bg-white text-[#1c1917] border border-[#e5e7eb] w-full min-h-[296mm] box-border">
            {/* Header */}
            <div className='text-center text-sm font-bold text-[#000000]  mb-2'>|| श्री गणेशाय नम: ||</div>
            <div className="flex gap-10 p-2 justify-between">
                <div className="flex gap-4">
                    <img src={invoicelogo} className='h-20 w-20' />
                    <div className='flex flex-col'>
                        <span className='text-2xl font-bold text-[#d97706] mb-2'>ओम आर्ट्स व कलाकेंद्र</span>
                        <span className='text-sm text-[#302f2e] font-semibold'>
                            पत्ता: कोल्हार बुद्रुक, तालुका : राहाता <br /> जिल्हा : अहिल्यानगर - 413710
                        </span>

                    </div>
                </div>
                <div className="flex flex-col gap-1 font-semibold">
                    <p>प्रो. सोन्याबपु शिवाजी वाकचौरे </p>
                    <p>+91 9822397846 </p>
                    <p>+91 8010072112 </p>
                </div>

            </div>

            <hr className="border-[#d6d3d1] my-3" />

            <h2 className="text-xl font-bold mb-6 text-center">Order Summary / ऑर्डर सारांश</h2>

            {/* Customer Details */}
            <div className="mb-4 p-4 bg-[#fafaf9] rounded-lg border border-[#e7e5e4]">
                <h3 className="font-bold text-lg mb-3 border-b border-[#e7e5e4] pb-2">Customer Details</h3>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-semibold text-[#000000]">Name:</span>
                    <span>{orderDetails?.name}</span>

                    <span className="font-semibold text-[#000000]">Phone:</span>
                    <span>{orderDetails?.phone}</span>

                    <span className="font-semibold text-[#000000]">Address:</span>
                    <span>{orderDetails?.address}</span>

                    <span className="font-semibold text-[#000000]">Order Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
                <h3 className="font-bold text-lg mb-4">Your Order</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#fef3c7] text-[#92400e]">
                            <th className="p-3 border-b-2 border-[#fde68a]">No.</th>
                            <th className="p-3 border-b-2 border-[#fde68a]">Product</th>
                            <th className="p-3 border-b-2 border-[#fde68a]">Size</th>
                            <th className="p-3 border-b-2 border-[#fde68a] text-center">Qty</th>
                            <th className="p-3 border-b-2 border-[#fde68a] text-right">Price</th>
                            <th className="p-3 border-b-2 border-[#fde68a] text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={index} className="border-b border-[#e7e5e4]">
                                <td className="p-3">{item.id}</td>
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{item.size || "Standard"}</td>
                                <td className="p-3 text-center">{item.qty}</td>
                                <td className="p-3 text-right">₹{item.price}</td>
                                <td className="p-3 text-right font-medium">₹{item.price * item.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-[#fafaf9] font-bold text-lg">
                            <td colSpan="5" className="p-3 text-right border-t-2 border-[#d6d3d1]">Total Amount:</td>
                            <td className="p-3 text-right border-t-2 border-[#d6d3d1] text-[#b45309]">₹{total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-sm text-[#78716c]">
                <p>Thank you for your order! Please contact us for payment and delivery.</p>
                <p className="mt-1">तुमच्या ऑर्डरबद्दल धन्यवाद! कृपया पेमेंट आणि वितरणासाठी आमच्याशी संपर्क साधा.</p>
            </div>
        </div>
    );
});

OrderSummaryTemplate.displayName = 'OrderSummaryTemplate';
export default OrderSummaryTemplate;
