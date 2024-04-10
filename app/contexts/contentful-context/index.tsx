'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { BlogPost } from '~/lib/contentful/api';

type Props = { blogPosts: BlogPost[] } & PropsWithChildren;

const ContentfulContext = createContext<{ blogPosts: BlogPost[] }>({ blogPosts: [] });

export const ContentfulProvider = ({ blogPosts, children }: Props) => {
  return <ContentfulContext.Provider value={{ blogPosts }}>{children}</ContentfulContext.Provider>;
};

export function useContentfulContext() {
  return useContext(ContentfulContext);
}
