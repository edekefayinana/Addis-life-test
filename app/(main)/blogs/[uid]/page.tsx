import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AgentBanner } from '../../../_components/AgentBanner';
import { filter } from '@prismicio/client';
import BlogContent from '../_components/BlogContent';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LatestBlogs from '../_components/LatestBlogs';
import { getTranslations } from 'next-intl/server';

type Params = { uid: string };

export default async function BlogDetails({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const t = await getTranslations('blogs');
  const client = createClient();
  const blogs = await client
    .getAllByType('blog_post', {
      filters: [filter.at('my.blog_post.slug', uid)],
      limit: 1,
    })
    .catch(() => []);

  const blog = blogs[0];

  if (!blog) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-10 py-14 mx-auto px-4">
      <div className="relative mx-auto w-full flex flex-col items-center justify-center max-w-[892px] gap-4">
        <Link
          href={'/blogs'}
          className="absolute hidden lg:flex items-center gap-2 rounded-full border py-1 shadow px-4 top-0 -left-44"
        >
          <ArrowLeft className="size-4" />
          {t('back')}
        </Link>
        <h1 className="text-3xl lg:text-5xl font-semibold leading-tight text-center">
          {blog.data.title}
        </h1>
        <div className="flex flex-col md:flex-row items-center md:gap-4 text-description">
          <p className="text-sm lg:text-base">{blog.data.author}</p>
          <span className="text-sm lg:text-base">•</span>
          <p className="text-sm lg:text-base">
            {new Date(blog.data.published_at as string).toLocaleDateString(
              'en-US',
              {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }
            )}
          </p>
        </div>
      </div>

      <div className="max-w-[1212px] mx-auto w-full relative aspect-video rounded-2xl overflow-hidden">
        <Image
          src={blog.data.cover.url || '/images/property-1.png'}
          alt={blog.data.title as string}
          fill
          className="object-cover"
        />
      </div>

      <BlogContent
        content={blog.data.blog_content}
        title={blog.data.title as string}
      />
      <LatestBlogs />

      <AgentBanner />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();
  const blogs = await client
    .getAllByType('blog_post', {
      filters: [filter.at('my.blog_post.slug', uid)],
      limit: 1,
    })
    .catch(() => []);

  const blog = blogs[0];

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.data.title,
    description: blog.data.description,
    openGraph: {
      images: [blog.data.cover.url || ''],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const blogs = await client.getAllByType('blog_post');

  return blogs.map((blog) => ({
    uid: (blog.data.slug as string) || blog.uid,
  }));
}
