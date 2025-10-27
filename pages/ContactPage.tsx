import React from 'react';
// FIX: Add BackButton to imports
import { EnvelopeIcon, MapPinIcon, PhoneIcon, WhatsAppIcon, BackButton } from '../components/icons';
import Footer from '../components/Footer';
import { Page } from '../types';

const ContactInfoCard: React.FC<{
  campus: string;
  address: string;
  poBox: string;
  phone: string;
  whatsapp?: string;
  email: string;
}> = ({ campus, address, poBox, phone, whatsapp, email }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">{campus}</h3>
    <ul className="space-y-4 text-gray-600">
      <li className="flex items-start">
        <MapPinIcon className="w-6 h-6 mr-4 text-indigo-500 flex-shrink-0 mt-1" />
        <div>
            {address} <br/>
            {poBox}
        </div>
      </li>
      <li className="flex items-start">
        <PhoneIcon className="w-6 h-6 mr-4 text-indigo-500 flex-shrink-0 mt-1" />
        <a href={`tel:${phone}`} className="hover:text-indigo-600">{phone}</a>
      </li>
      {whatsapp && (
        <li className="flex items-start">
            <WhatsAppIcon className="w-6 h-6 mr-4 text-green-500 flex-shrink-0 mt-1" />
            <a href={`https://wa.me/${whatsapp.replace('+', '')}`} className="hover:text-indigo-600" target="_blank" rel="noopener noreferrer">{whatsapp} (WhatsApp)</a>
        </li>
      )}
      <li className="flex items-start">
        <EnvelopeIcon className="w-6 h-6 mr-4 text-indigo-500 flex-shrink-0 mt-1" />
        <a href={`mailto:${email}`} className="hover:text-indigo-600">{email}</a>
      </li>
    </ul>
  </div>
);

// FIX: Add handleBack to component props
interface ContactPageProps {
  handleBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ handleBack }) => {
    // Coordinates: 15°22'44"S 28°16'44"E
    // Decimal: -15.3788, 28.2788
    const mapSrc = "https://maps.google.com/maps?q=-15.3788,28.2788&hl=es&z=14&amp;output=embed";

    return (
    <div className="bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-2 text-lg text-purple-200">We're here to help. Reach out to us with any questions.</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* FIX: Add BackButton component */}
        <BackButton onClick={handleBack} className="mb-8" />
        {/* Map */}
        <section className="mb-16">
            <div className="rounded-lg overflow-hidden shadow-2xl">
                 <iframe
                    src={mapSrc}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Get In Touch Form */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input type="text" id="name" required className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                            <input type="email" id="email" required className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input type="text" id="subject" required className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200" />
                    </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea id="message" rows={5} required className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">Send Message</button>
                    </div>
                </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
                 <ContactInfoCard 
                    campus="Lusaka (Main Campus)"
                    address="Off Mungule Road, 10 Miles, Lusaka, Zambia"
                    poBox="P.O. Box: 31108, Lusaka, Zambia"
                    phone="+260 967 967 961"
                    whatsapp="+260 772 893 973"
                    email="apply@rockview.ac.zm"
                />
                 <ContactInfoCard 
                    campus="Chipata Campus"
                    address="School of Health Sciences, Katopola Road, Near Katambala Market, Chipata"
                    poBox="-"
                    phone="+260 967 967 961"
                    email="apply@rockview.ac.zm"
                />
            </div>
        </div>
      </div>
       <Footer onNavigate={() => {}} />
    </div>
    );
};

export default ContactPage;
