import { Shield, Lock, CreditCard, UserCheck } from 'lucide-react';

const policies = [
  {
    title: 'Privacy Policy',
    icon: Lock,
    content: `We respect your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information when you use our website or services.

Key points:
• We only collect information necessary to process your orders and improve your shopping experience
• Your personal data is encrypted and stored securely
• We never share your information with third parties for marketing purposes
• You can request access to, modification of, or deletion of your data at any time`,
  },
  {
    title: 'Terms of Service',
    icon: Shield,
    content: `By using our website and services, you agree to these terms of service. Please read them carefully before making a purchase.

Key points:
• You must be 18 years or older to make a purchase
• All prices are listed in USD unless otherwise specified
• We reserve the right to refuse service to anyone
• Product images are representative but may vary slightly from actual items`,
  },
  {
    title: 'Payment Security',
    icon: CreditCard,
    content: `We use industry-standard security measures to protect your payment information.

Key points:
• All payments are processed through secure, encrypted connections
• We are PCI DSS compliant
• Multiple payment methods accepted
• Fraud prevention measures are in place to protect both you and us`,
  },
  {
    title: 'Account Policy',
    icon: UserCheck,
    content: `Your account security and privacy are important to us.

Key points:
• Strong password requirements
• Two-factor authentication available
• Regular security audits
• Immediate notification of suspicious activity`,
  },
];

export default function Policies() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Policies
          </h1>
          
          <div className="mt-8 space-y-12">
            {policies.map((policy) => (
              <section key={policy.title} className="relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <policy.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="ml-4 text-2xl font-semibold text-gray-900">{policy.title}</h2>
                </div>
                
                <div className="mt-4 prose prose-indigo max-w-none">
                  <div className="whitespace-pre-wrap">{policy.content}</div>
                </div>
              </section>
            ))}

            <section className="bg-gray-50 rounded-lg p-6 mt-8">
              <h2 className="text-lg font-medium text-gray-900">Need Help?</h2>
              <p className="mt-2 text-sm text-gray-500">
                If you have any questions about our policies, please don't hesitate to contact our customer service team.
              </p>
              <div className="mt-4">
                <a
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Contact Support
                  <span aria-hidden="true"> →</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}