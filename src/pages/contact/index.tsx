import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';

const locations = [
  {
    name: 'Downtown Store',
    address: '213 S Kalamazoo Mall',
    city: 'Kalamazoo, MI 49007',
    phone: '(269) 342-1234',
    hours: {
      'Monday - Friday': '10am - 6pm',
      'Saturday': '10am - 4pm',
      'Sunday': 'Closed'
    }
  },
  {
    name: 'Portage Store - Crossroads Mall',
    address: '6650 S Westnedge Ave',
    city: 'Portage, MI 49024',
    phone: '(269) 323-8070',
    hours: {
      'Monday - Saturday': '10am - 9pm',
      'Sunday': '12pm - 6pm'
    }
  }
];

const contactMethods = [
  {
    name: '24/7 Customer Support',
    description: 'Call or text anytime for immediate assistance',
    phone: '(269) 532-4852',
    icon: Phone,
    availability: 'Available 24/7',
  },
  {
    name: 'Email Support',
    description: 'Send us a message for non-urgent inquiries',
    email: 'KCTMenswear@gmail.com',
    icon: Mail,
    availability: 'Response within 24 hours',
  },
  {
    name: 'Book Appointment',
    description: 'Schedule a fitting or consultation',
    icon: Clock,
    availability: 'See available time slots',
    action: 'Book Now',
  },
  {
    name: 'Live Chat',
    description: 'Chat with our style experts',
    icon: MessageSquare,
    availability: 'Available during store hours',
    action: 'Start Chat',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Message sent! We will get back to you soon.');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-charcoal-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-charcoal-300">
              We're here to help with all your formal wear needs. Reach out to us anytime, day or night.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <div
              key={method.name}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-charcoal-900/5 hover:bg-charcoal-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-burgundy-600">
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold text-charcoal-900">{method.name}</h3>
                  <p className="text-sm text-charcoal-500">{method.availability}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-charcoal-500">{method.description}</p>
                {method.phone && (
                  <a
                    href={`tel:${method.phone}`}
                    className="mt-2 block text-base font-medium text-burgundy-600 hover:text-burgundy-500"
                  >
                    {method.phone}
                  </a>
                )}
                {method.email && (
                  <a
                    href={`mailto:${method.email}`}
                    className="mt-2 block text-base font-medium text-burgundy-600 hover:text-burgundy-500"
                  >
                    {method.email}
                  </a>
                )}
                {method.action && (
                  <button className="mt-4 inline-flex items-center rounded-md bg-navy-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-500">
                    {method.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Locations */}
      <div className="bg-charcoal-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal-900">Our Locations</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {locations.map((location) => (
              <div
                key={location.name}
                className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-charcoal-900/5 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-x-4">
                  <MapPin className="h-6 w-6 text-burgundy-600" />
                  <h3 className="text-lg font-semibold text-charcoal-900">{location.name}</h3>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex gap-x-4">
                    <div className="flex-auto">
                      <p className="text-sm text-charcoal-600">{location.address}</p>
                      <p className="text-sm text-charcoal-600">{location.city}</p>
                    </div>
                    <a
                      href={`tel:${location.phone}`}
                      className="flex items-center gap-x-2 text-burgundy-600 hover:text-burgundy-500"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="text-sm">{location.phone}</span>
                    </a>
                  </div>
                  <div className="border-t border-charcoal-100 pt-4">
                    <h4 className="text-sm font-medium text-charcoal-900">Store Hours</h4>
                    <dl className="mt-2 space-y-1">
                      {Object.entries(location.hours).map(([days, hours]) => (
                        <div key={days} className="flex justify-between gap-x-4 text-sm">
                          <dt className="text-charcoal-600">{days}</dt>
                          <dd className="text-charcoal-900">{hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-charcoal-900">Send us a message</h2>
          <p className="mt-2 text-lg leading-8 text-charcoal-600">
            Have a question or need assistance? Fill out the form below and we'll get back to you.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-charcoal-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-charcoal-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-charcoal-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700">
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-charcoal-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-charcoal-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1 block w-full rounded-md border-charcoal-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-charcoal-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full rounded-md border-charcoal-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-burgundy-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-burgundy-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}