import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { BlogPageSEO } from '@/components/seo/BlogPageSEO';

const blogs = [
  {
    id: 'kalamazoo-custom-tailoring-suits-weddings-and-proms-by-kct-menswear-5',
    title: 'The Art of Custom Tailoring: A Guide to Perfect Fit',
    excerpt: 'Discover the craftsmanship behind our custom tailoring services and learn how we ensure the perfect fit for every garment.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
    category: 'Style Guide',
    author: 'KCT Menswear',
    date: '2024-03-01',
    readTime: '5 min read',
    tags: ['Custom Tailoring', 'Menswear', 'Style Tips'],
    url: 'https://kctmenswear.com/blogs/kalamazoo-custom-tailoring-suits-weddings-and-proms-by-kct-menswear-5'
  },
  {
    id: 'prom-style-tips-trends-and-fashion-advice-3',
    title: 'Prom 2024: Style Tips, Trends & Fashion Advice',
    excerpt: 'Get ready for prom season with our comprehensive guide to the latest trends, styling tips, and fashion advice for a memorable night.',
    image: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&q=80',
    category: 'Trends',
    author: 'KCT Menswear',
    date: '2024-02-15',
    readTime: '4 min read',
    tags: ['Prom', 'Fashion Trends', 'Style Guide'],
    url: 'https://kctmenswear.com/blogs/prom-style-tips-trends-and-fashion-advice-3'
  },
  {
    id: 'news',
    title: 'Latest Updates from KCT Menswear',
    excerpt: 'Stay up to date with the latest news, events, and announcements from KCT Menswear.',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
    category: 'News',
    author: 'KCT Menswear',
    date: '2024-02-01',
    readTime: '3 min read',
    tags: ['News', 'Events', 'Announcements'],
    url: 'https://kctmenswear.com/blogs/news'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <BlogPageSEO articles={blogs} />

      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80"
            alt="KCT Menswear Blog"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-900/50 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Style & Substance
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Insights, trends, and expert advice from Southwest Michigan's premier menswear destination
            </p>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.image}
                  alt={post.title}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {post.category}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="inline-flex items-center text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <a href={post.url} className="mt-4 block">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </a>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-sm text-gray-600"
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">{post.author}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author}
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <span>
                        <Calendar className="mr-1.5 inline-block h-4 w-4" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href={post.url}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}