import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  try {
    let query = supabaseAdmin.from('blogposts').select('*');

    const isNumericId = /^\d+$/.test(slug);
    if (isNumericId) {
      query = query.eq('id', slug);
    } else {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.eq('is_published', true).single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export const revalidate = 0;

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Kislay Naturals',
    };
  }

  const publishedTime = post.published_at || post.created_at || new Date().toISOString();

  return {
    title: post.meta_title || `${post.title} | Kislay Naturals`,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords || '',
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime,
      authors: ['Kislay Naturals'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
    },
  };
}

export default async function DynamicBlogPost({ params }: BlogPostProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return notFound();
  }

  const publishedDate = post.published_at || post.created_at
    ? new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/blog"
                className="flex items-center text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Blog
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/" className="text-white hover:text-yellow-300 transition-colors">
                Kislay Naturals
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>{publishedDate}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>{post.author || 'Kislay Naturals'}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-gray-900 mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none prose-green">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || ''}
              </ReactMarkdown>
              
              {/* Optional CTA */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mt-12 mb-8 not-prose">
                <h3 className="text-xl font-bold mb-3">Make the Switch Today</h3>
                <p className="mb-4">
                  Shop our premium natural monk fruit sweeteners and experience the difference.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
