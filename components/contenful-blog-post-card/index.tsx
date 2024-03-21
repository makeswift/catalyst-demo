import Image from 'next/image';

import {
  BlogPostAuthor,
  BlogPostBanner,
  BlogPostContent,
  BlogPostDate,
  BlogPostImage,
  BlogPostTitle,
  BlogPostCard as ComponentsBlogPostCard,
} from '@bigcommerce/components/blog-post-card';
import { Link } from '~/components/link';
import { BlogPost } from '~/lib/contenful/api';

interface BlogPostCardProps {
  blogPost: BlogPost;
}

export const ContentfulBlogPostCard = ({ blogPost }: BlogPostCardProps) => (
  <ComponentsBlogPostCard>
    {blogPost.thumbnailImage ? (
      <BlogPostImage>
        <Link className="block w-full" href={`/blog/${blogPost.title}`}>
          <Image
            alt={`Picture of ${blogPost.title}`}
            className="h-full w-full object-cover object-center"
            height={300}
            src={blogPost.thumbnailImage.url}
            width={300}
          />
        </Link>
      </BlogPostImage>
    ) : (
      <BlogPostBanner>
        <BlogPostTitle variant="inBanner">
          <span className="line-clamp-3 text-blue-primary">{blogPost.title}</span>
        </BlogPostTitle>
        <BlogPostDate variant="inBanner">
          <span className="text-blue-primary">
            {new Intl.DateTimeFormat('en-US').format(new Date(blogPost.publishDate))}
          </span>
        </BlogPostDate>
      </BlogPostBanner>
    )}

    <BlogPostTitle>
      <Link href={`/blog/${blogPost.title}`}>{blogPost.title}</Link>
    </BlogPostTitle>
    <BlogPostContent>{blogPost.plainTextSummary}</BlogPostContent>
    <BlogPostDate>
      {new Intl.DateTimeFormat('en-US').format(new Date(blogPost.publishDate))}
    </BlogPostDate>
    {blogPost.author ? <BlogPostAuthor>, by {blogPost.author.fullName}</BlogPostAuthor> : null}
  </ComponentsBlogPostCard>
);
