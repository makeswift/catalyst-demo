import { Tag } from '~/lib/contenful/api';
import { ContentfulBlogPostCard } from '../contenful-blog-post-card';
import { useContentfulContext } from '~/app/contexts/contentful-context';

type Props = {
  limit?: number;
  className?: string;
  tag?: Tag;
  title?: string;
};

export function ContentfulBlogPostList({
  title = 'Blog',
  tag,
  className,
  limit = Infinity,
}: Props) {
  const { blogPosts } = useContentfulContext();

  const filteredBlogPosts = blogPosts
    .filter((post) =>
      post.tagCollection.items.some((blogPostTag) =>
        tag ? blogPostTag.sys.id === tag.sys.id : true,
      ),
    )
    .slice(0, limit);

  return (
    <div className={className}>
      <h2 className="mb-8 text-3xl font-black lg:text-5xl">{title}</h2>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {filteredBlogPosts.map((post) => (
          <ContentfulBlogPostCard blogPost={post} />
        ))}
      </div>
    </div>
  );
}
