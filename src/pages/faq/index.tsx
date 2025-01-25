import { useState } from 'react';
import { ChevronDown, HelpCircle, Truck, RotateCcw, CreditCard, Ruler, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FAQPageSEO } from '@/components/seo/FAQPageSEO';

const faqs = [
  {
    category: 'Orders & Shipping',
    icon: Truck,
    questions: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business days delivery. International shipping may take 7-14 business days.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location.'
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you\'ll receive a confirmation email with tracking information. You can also track your order by logging into your account.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    icon: RotateCcw,
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 60-day return policy for unworn items with original tags attached. Returns must be initiated within 60 days of purchase.'
      },
      {
        question: 'How do I start a return?',
        answer: 'Log into your account, visit our returns portal, select the items you wish to return, and follow the instructions to print your return label.'
      },
      {
        question: 'Are alterations refundable?',
        answer: 'Alteration services are non-refundable. However, we offer complimentary adjustments within 30 days of the original alteration.'
      }
    ]
  },
  {
    category: 'Payment & Pricing',
    icon: CreditCard,
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Shop Pay.'
      },
      {
        question: 'Do you offer price matching?',
        answer: 'Yes, we offer price matching on identical items from authorized retailers. Contact our customer service team with the competitor\'s listing.'
      },
      {
        question: 'Are there any hidden costs?',
        answer: 'No hidden costs. All prices include standard alterations. Additional services like rush alterations may incur extra charges.'
      }
    ]
  },
  {
    category: 'Alterations & Fitting',
    icon: Ruler,
    questions: [
      {
        question: 'How long do alterations take?',
        answer: 'Standard alterations typically take 5-7 business days. Rush service is available for 24-48 hour turnaround at an additional cost.'
      },
      {
        question: 'What alterations are included?',
        answer: 'Basic alterations (hem, sleeve length, waist) are included with your purchase. Additional modifications may incur extra charges.'
      },
      {
        question: 'Do I need an appointment for alterations?',
        answer: 'Yes, we recommend scheduling an alteration appointment to ensure our full attention to your fitting needs.'
      }
    ]
  }
];

const supportInfo = [
  {
    title: 'Customer Service',
    description: 'Our team is available Monday-Friday, 9am-6pm EST',
    icon: MessageCircle,
    contact: {
      email: 'support@kctmenswear.com',
      phone: '1-800-555-0123'
    }
  },
  {
    title: 'Store Locations',
    description: 'Visit us in person for personalized service',
    icon: HelpCircle,
    link: '/locations'
  }
];

export default function FAQ() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Transform faqs data for SEO component
  const faqsForSEO = faqs.flatMap(category => 
    category.questions.map(q => ({
      question: q.question,
      answer: q.answer,
      category: category.category
    }))
  );

  const toggleCategory = (category: string) => {
    const newOpenCategories = new Set(expandedCategories);
    if (newOpenCategories.has(category)) {
      newOpenCategories.delete(category);
    } else {
      newOpenCategories.add(category);
    }
    setExpandedCategories(newOpenCategories);
  };

  const toggleQuestion = (question: string) => {
    const newOpenQuestions = new Set(expandedQuestions);
    if (newOpenQuestions.has(question)) {
      newOpenQuestions.delete(question);
    } else {
      newOpenQuestions.add(question);
    }
    setExpandedQuestions(newOpenQuestions);
  };

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSEO faqs={faqsForSEO} />

      {/* Hero Section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              How can we help?
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Find answers to common questions and get the support you need
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        {/* Support Information */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mb-16">
          {supportInfo.map((info) => (
            <div
              key={info.title}
              className="relative overflow-hidden rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <info.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{info.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{info.description}</p>
                  {'contact' in info && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-700">
                        Email: {info.contact.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        Phone: {info.contact.phone}
                      </p>
                    </div>
                  )}
                  {'link' in info && (
                    <a
                      href={info.link}
                      className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Find a store near you
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category) => (
            <div key={category.category} className="border-b border-gray-200 pb-8">
              <button
                onClick={() => toggleCategory(category.category)}
                className="flex w-full items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <category.icon className="h-6 w-6 text-indigo-600" />
                  <h2 className="ml-3 text-2xl font-semibold text-gray-900">
                    {category.category}
                  </h2>
                </div>
                <ChevronDown
                  className={cn(
                    'h-6 w-6 text-gray-400 transition-transform',
                    expandedCategories.has(category.category) ? 'rotate-180' : ''
                  )}
                />
              </button>

              {/* Questions */}
              {expandedCategories.has(category.category) && (
                <div className="mt-8 space-y-6">
                  {category.questions.map((item) => (
                    <div key={item.question} className="rounded-lg bg-gray-50 p-6">
                      <button
                        onClick={() => toggleQuestion(item.question)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 text-gray-500 transition-transform',
                            expandedQuestions.has(item.question) ? 'rotate-180' : ''
                          )}
                        />
                      </button>
                      {expandedQuestions.has(item.question) && (
                        <p className="mt-4 text-gray-600">{item.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help Section */}
        <div className="mt-16">
          <div className="rounded-2xl bg-indigo-50 px-6 py-8 sm:px-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-indigo-900">
                Still have questions?
              </h3>
              <p className="mt-2 text-sm text-indigo-700">
                Can't find what you're looking for? We're here to help.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <a
                  href="/contact"
                  className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Contact Support
                </a>
                <a
                  href="/chat"
                  className="rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Live Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}