import { useParams } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPostSEO } from '@/components/seo/BlogPostSEO';

// Mock blog data - replace with real API call
const blogPosts = {
  'kalamazoo-custom-tailoring-suits-weddings-and-proms-by-kct-menswear-5': {
    title: 'The Art of Custom Tailoring: A Guide to Perfect Fit',
    content: `
      <p>At KCT Menswear, we believe that the perfect fit is not just about measurements—it's about understanding the unique characteristics of each client and crafting garments that enhance their natural silhouette.</p>
      
      <h2>The Importance of Custom Tailoring</h2>
      <p>Custom tailoring is more than just alterations; it's about creating a garment that fits you perfectly in every way. Our expert tailors take into account your body shape, posture, and personal style preferences to create clothing that not only fits well but feels comfortable and looks exceptional.</p>
      
      <h2>Our Tailoring Process</h2>
      <ul>
        <li>Initial consultation and measurements</li>
        <li>Fabric selection and style discussion</li>
        <li>First fitting and adjustments</li>
        <li>Final fitting and finishing touches</li>
      </ul>
      
      <h2>Why Choose Custom Tailoring?</h2>
      <p>Off-the-rack suits are designed to fit an average body type, but every person is unique. Custom tailoring ensures that your garments:</p>
      <ul>
        <li>Fit perfectly in all the right places</li>
        <li>Enhance your best features</li>
        <li>Provide maximum comfort</li>
        <li>Last longer due to proper fit</li>
      </ul>
    `,
    excerpt: 'Discover the craftsmanship behind our custom tailoring services and learn how we ensure the perfect fit for every garment.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
    category: 'Style Guide',
    author: 'KCT Menswear',
    date: '2024-03-01',
    readTime: '5 min read',
    tags: ['Custom Tailoring', 'Menswear', 'Style Tips']
  },
  'prom-style-tips-trends-and-fashion-advice-3': {
    title: 'Prom 2024: Style Tips, Trends & Fashion Advice',
    content: `
      <p>Make your prom night unforgettable with our comprehensive guide to the latest trends and style tips for 2024.</p>
      
      <h2>2024 Prom Trends</h2>
      <p>This year's prom season brings exciting new trends that combine classic elegance with modern flair:</p>
      <ul>
        <li>Sparkle blazers in bold colors</li>
        <li>Modern tuxedos with unique details</li>
        <li>Statement accessories</li>
        <li>Textured fabrics</li>
      </ul>
      
      <h2>Choosing the Perfect Fit</h2>
      <p>Your prom suit or tuxedo should fit perfectly to ensure you look and feel your best. Consider these factors:</p>
      <ul>
        <li>Shoulder fit</li>
        <li>Sleeve length</li>
        <li>Trouser break</li>
        <li>Overall comfort</li>
      </ul>
      
      <h2>Accessorizing Your Look</h2>
      <p>The right accessories can elevate your prom outfit from great to extraordinary:</p>
      <ul>
        <li>Coordinated bow ties or neckties</li>
        <li>Pocket squares</li>
        <li>Cufflinks</li>
        <li>Dress shoes</li>
      </ul>
    `,
    excerpt: 'Get ready for prom season with our comprehensive guide to the latest trends, styling tips, and fashion advice for a memorable night.',
    image: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&q=80',
    category: 'Trends',
    author: 'KCT Menswear',
    date: '2024-02-15',
    readTime: '4 min read',
    tags: ['Prom', 'Fashion Trends', 'Style Guide']
  },
  'news': {
    title: 'Latest Updates from KCT Menswear',
    content: `
      <p>Stay informed about the latest happenings at KCT Menswear, including new collections, events, and special announcements.</p>
      
      <h2>New Spring Collection Arrival</h2>
      <p>We're excited to announce the arrival of our Spring 2024 collection, featuring:</p>
      <ul>
        <li>Lightweight suits in seasonal colors</li>
        <li>New designer collaborations</li>
        <li>Expanded accessory selection</li>
        <li>Limited edition pieces</li>
      </ul>
      
      <h2>Upcoming Events</h2>
      <p>Mark your calendars for these exciting events:</p>
      <ul>
        <li>Spring Fashion Show - April 2024</li>
        <li>Trunk Show Weekend - May 2024</li>
        <li>Customer Appreciation Day - June 2024</li>
      </ul>
      
      <h2>Store Updates</h2>
      <p>We're constantly improving to serve you better:</p>
      <ul>
        <li>Extended store hours</li>
        <li>New fitting room experience</li>
        <li>Enhanced online shopping features</li>
      </ul>
    `,
    excerpt: 'Stay up to date with the latest news, events, and announcements from KCT Menswear.',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
    category: 'News',
    author: 'KCT Menswear',
    date: '2024-02-01',
    readTime: '3 min read',
    tags: ['News', 'Events', 'Announcements']
  }
};

export default function BlogPost() {
  const { id } = useParams();
  const post = id ? blogPosts[id as keyof typeof blogPosts] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for could not be found.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BlogPostSEO post={post} />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-3xl">
              <Link
                to="/blog"
                className="inline-flex items-center text-white hover:text-gray-200 mb-8"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Blog
              </Link>
              <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1">
                  {post.category}
                </span>
                <span className="inline-flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="inline-flex items-center">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-xl text-gray-200">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        <article className="prose prose-lg prose-indigo max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Tags */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
              >
                <Tag className="mr-1.5 h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Info */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                Written by {post.author}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Expert insights from Southwest Michigan's premier menswear destination
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}