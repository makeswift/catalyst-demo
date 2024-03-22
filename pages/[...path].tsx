// eslint-disable-next-line check-file/filename-naming-convention
import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { ContentfulProvider } from '~/app/contexts/contentful-context';
import { Footer } from '~/components/footer/client';
import { PagesHeader } from '~/components/header/client';
import { getAllBlogPosts } from '~/lib/contenful/api';
import { getConfig } from '~/lib/makeswift/config';
import { runtime } from '~/lib/makeswift/runtime';
import '~/lib/makeswift/components';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticPaths() {
  const config = getConfig();
  const makeswift = new Makeswift(config.makeswift.siteApiKey);
  const pages = await makeswift.getPages();

  return {
    paths: pages.map((page) => ({
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
      },
    })),
    fallback: 'blocking',
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ path: string[] }>) {
  const config = getConfig();
  const makeswift = new Makeswift(config.makeswift.siteApiKey, { runtime });

  const path = `/${(ctx.params?.path ?? []).join('/')}`;

  const snapshot = await makeswift.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
  });

  const blogPosts = await getAllBlogPosts();

  if (snapshot == null) {
    return { notFound: true };
  }

  return {
    props: {
      snapshot,
      blogPosts,
    },
  };
}

export default function Page({ snapshot, blogPosts }: Props) {
  return (
    <ContentfulProvider blogPosts={blogPosts}>
      <PagesHeader />
      <MakeswiftPage runtime={runtime} snapshot={snapshot} />
      <Footer />
    </ContentfulProvider>
  );
}
