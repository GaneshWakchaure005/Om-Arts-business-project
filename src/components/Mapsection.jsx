
export default function Mapsection() {
    return (
        <section className="mb-10 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="px-4 py-4 sm:px-6">
                <h4 className="font-bold text-stone-900 dark:text-white">Visit us</h4>
                <p className="mt-1 text-sm text-stone-600 dark:text-gray-400">
                    Om Arts Ganpati workshop
                </p>
            </div>
            <div className="relative h-64 w-full sm:h-80 lg:h-96">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.9978466136195!2d74.5276792749898!3d19.539828781762594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdcf36a19273907%3A0x712005a34d819a9!2sOm%20Arts%20Ganpati%20workshop!5e1!3m2!1sen!2sin!4v1779806650035!5m2!1sen!2sin"
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Om Arts Ganpati workshop location"
                ></iframe>
            </div>
        </section>
    )
}
