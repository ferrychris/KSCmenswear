import { RefreshCw, Shield, MessageCircle, CheckCircle, Package, Clock, AlertTriangle, Shirt } from 'lucide-react';

const returnFeatures = [
  {
    name: 'Money-Back Guarantee',
    description: 'Return eligible items for a full refund within 10 days of delivery',
    icon: RefreshCw,
  },
  {
    name: 'Expert Sizing Help',
    description: 'Contact us before or after ordering for sizing assistance',
    icon: Shield,
  },
  {
    name: '24/7 Support',
    description: 'Contact us anytime for return assistance',
    icon: MessageCircle,
  },
  {
    name: 'Easy Process',
    description: 'Simple email-based return initiation',
    icon: CheckCircle,
  },
];

const returnGuidelines = {
  shirts: {
    icon: Shirt,
    title: 'Shirts',
    conditions: [
      'Must be returned in original packaging',
      'Repackaged items accepted without fee',
      'Balled-up returns may incur restocking fee',
      'Missing packaging/tags: 50% restocking fee',
      'No packaging: Return rejected'
    ]
  },
  shoes: {
    icon: Package,
    title: 'Shoes',
    conditions: [
      'Must be in original condition and packaging',
      'No signs of wear or use',
      'No walking creases or dirt on soles',
      'Damaged box: 50% restocking fee',
      'May be rejected if improperly packaged'
    ]
  },
  formalwear: {
    icon: Shield,
    title: 'Tuxedos/Suits',
    conditions: [
      'All tags must be intact',
      'No alterations or tailoring',
      'Must include hanger and garment bag',
      'Missing packaging: 50% restocking fee',
      'Altered items cannot be returned'
    ]
  },
  boys: {
    icon: Package,
    title: 'Boys Tuxedos/Suits',
    conditions: [
      'All items must be returned together',
      'Original packaging required',
      'Tags must be attached',
      'Incomplete sets cannot be returned',
      'Must be in original condition'
    ]
  }
};

const returnProcess = [
  {
    title: 'Contact Us',
    description: 'Email KCTMenswear@gmail.com with subject "Return/Exchange - Order Number"',
    icon: MessageCircle,
  },
  {
    title: 'Wait for Response',
    description: 'Our team will review your request and provide return instructions',
    icon: Clock,
  },
  {
    title: 'Ship Items Back',
    description: 'Return to our Kalamazoo store location (not to manufacturers)',
    icon: Package,
  },
  {
    title: 'Inspection & Refund',
    description: 'Items inspected within one day and refund processed after approval',
    icon: CheckCircle,
  },
];

export default function Returns() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Returns & Exchanges
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              With over 40 years of amazing customer service, we're committed to ensuring your complete satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        {/* Return Features */}
        <section className="mb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {returnFeatures.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Return Policy Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Return Policy</h2>
          
          <div className="prose prose-indigo max-w-none">
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Eligibility Requirements</h3>
              <ul className="space-y-2">
                <li>Items must be unused and in the same condition as received</li>
                <li>Original packaging and tags must be included</li>
                <li>No deodorant stains, sweat stains, make-up stains, or animal hair</li>
                <li>No cologne, body odor, or smoke smell</li>
                <li>Item must be resellable as new</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">Refund Timeline</h3>
                <p className="text-indigo-700">
                  Items being returned for a refund must be returned within 10 days of delivery.
                  Items cannot have been worn!
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">Exchange Timeline</h3>
                <p className="text-indigo-700">
                  Items being returned for an exchange must be returned within 30 days of delivery.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-900">Important Note</h3>
              </div>
              <p className="text-amber-700">
                Items returned used, not in the same condition, or without original packaging may be 
                subject to a 50% restocking fee or rejected.
              </p>
            </div>
          </div>
        </section>

        {/* Product-Specific Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(returnGuidelines).map(([key, item]) => (
              <div key={key} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-indigo-600 mt-1">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Return Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Return Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnProcess.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                </div>
                {index < returnProcess.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full border-t-2 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Return Address */}
        <section className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Address</h2>
          <div className="max-w-xl">
            <p className="text-gray-600 mb-4">
              Please return all items to our Kalamazoo location:
            </p>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="font-medium text-gray-900">KCT Menswear</p>
              <p className="text-gray-600">213 S Kalamazoo Mall</p>
              <p className="text-gray-600">Kalamazoo, MI 49007</p>
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> DO NOT return any items to manufacturers, even if shipped directly 
                from them. All returns must be sent to KCT Menswear.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our team is here to assist you with any questions about returns or exchanges.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:KCTMenswear@gmail.com"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Email Us
            </a>
            <a
              href="tel:+12693522015"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Call (269) 352-2015
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}