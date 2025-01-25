import { Shield, Lock, Cookie, Users, Bell, Eye } from 'lucide-react';
import { PolicyPageSEO } from '@/components/seo/PolicyPageSEO';

const sections = [
  {
    id: 'collection',
    icon: Users,
    title: 'Information Collection',
    content: `We collect information when you:
      • Register on our site
      • Place an order
      • Subscribe to our newsletter
      • Respond to a survey
      • Fill out a form

    Information collected may include:
      • Name
      • Email address
      • Mailing address
      • Phone number

    Note: You may visit our site anonymously.`,
  },
  {
    id: 'usage',
    icon: Eye,
    title: 'Information Usage',
    content: `Your information helps us to:
      • Personalize your experience
      • Improve our website
      • Improve customer service
      • Process transactions
      • Send periodic emails

    Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company without your consent, other than for the express purpose of delivering purchased products or services.`,
  },
  {
    id: 'protection',
    icon: Shield,
    title: 'Information Protection',
    content: `We implement various security measures to maintain the safety of your personal information when you:
      • Place an order
      • Enter, submit, or access your information
      
    After a transaction, your private information (credit cards, social security numbers, financials, etc.) will not be kept on file for more than 60 days.`,
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: 'Cookies Usage',
    content: `We use cookies to:
      • Help remember and process items in your shopping cart
      • Keep track of advertisements
      • Compile aggregate data about site traffic and interactions
      
    Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if allowed) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.`,
  },
  {
    id: 'disclosure',
    icon: Lock,
    title: 'Information Disclosure',
    content: `We do not sell, trade, or transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in:
      • Operating our website
      • Conducting our business
      • Servicing you

    We may release your information when we believe release is appropriate to:
      • Comply with the law
      • Enforce our site policies
      • Protect ours or others' rights, property, or safety`,
  },
  {
    id: 'updates',
    icon: Bell,
    title: 'Policy Updates',
    content: `We may update this privacy policy at any time. We will notify you of any changes by:
      • Posting the new privacy policy on this page
      • Sending an email notification
      • Displaying a prominent notice on our website`,
  },
];

export default function Privacy() {
  return (
    <div className="bg-white">
      <PolicyPageSEO 
        type="privacy"
        lastUpdated="2024-03-01"
      />
      
      {/* Hero Section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated Banner */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <p className="text-sm text-gray-500">
            Last Updated: March 1, 2024
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Introduction */}
          <div className="prose prose-lg prose-indigo">
            <p>
              At KCT Menswear, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains our practices regarding the 
              collection, use, and disclosure of your information through our website and services.
            </p>
          </div>

          {/* Main Sections */}
          <div className="mt-16 space-y-16">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-16">
                <div className="flex items-center gap-x-3">
                  <section.icon className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-6 prose prose-indigo prose-lg">
                  <div className="whitespace-pre-line">{section.content}</div>
                </div>
              </section>
            ))}
          </div>

          {/* COPPA Compliance */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Children's Online Privacy Protection Act Compliance
            </h2>
            <div className="mt-6 prose prose-indigo prose-lg">
              <p>
                We are in compliance with the requirements of COPPA (Children's Online Privacy 
                Protection Act). We do not collect any information from anyone under 13 years of age. 
                Our website, products, and services are all directed to people who are at least 13 
                years old or older.
              </p>
            </div>
          </section>

          {/* Your Consent */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Your Consent
            </h2>
            <div className="mt-6 prose prose-indigo prose-lg">
              <p>
                By using our site, you consent to our privacy policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Contact Us
            </h2>
            <div className="mt-6 prose prose-indigo prose-lg">
              <p>
                If you have any questions regarding this privacy policy, you may contact us using 
                the information below:
              </p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+12693421234" className="text-indigo-600 hover:text-indigo-500">
                    (269) 342-1234
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:KCTMenswear@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                    KCTMenswear@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href="/terms"
                className="flex items-center gap-x-3 rounded-lg border border-gray-200 p-4 hover:bg-white"
              >
                <Lock className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Terms of Service</span>
              </a>
              <a
                href="/contact"
                className="flex items-center gap-x-3 rounded-lg border border-gray-200 p-4 hover:bg-white"
              >
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Contact Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}