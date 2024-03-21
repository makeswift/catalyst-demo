'use client';

import { PropsWithChildren, createContext, useContext } from 'react';
import { BlogPost } from '~/lib/contenful/api';

type Props = { blogPosts: BlogPost[] } & PropsWithChildren;

const ContentfulContext = createContext<{ blogPosts: BlogPost[] }>({ blogPosts: [] });

export const ContentfulProvider = ({ blogPosts, children }: Props) => {
  return <ContentfulContext.Provider value={{ blogPosts }}>{children}</ContentfulContext.Provider>;
};

export function useContentfulContext() {
  const context = useContext(ContentfulContext);

  if (!context) {
    throw new Error('useContentfulContext must be used within a ContentfulContext');
  }

  return context;
}
