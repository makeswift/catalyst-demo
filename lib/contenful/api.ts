import { z } from 'zod';

import { getConfig } from '../makeswift/config';

async function fetchGraphQL(query: string): Promise<unknown> {
  const config = getConfig();

  return fetch(`https://graphql.contentful.com/content/v1/spaces/${config.contentful.spaceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.contentful.accessToken}`,
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
}

export const tagSchema = z.object({
  label: z.string(),
  sys: z.object({
    id: z.string(),
  }),
});

export type Tag = z.infer<typeof tagSchema>;

const blogSchema = z.object({
  title: z.string(),
  publishDate: z.string(),
  plainTextSummary: z.string(),
  author: z
    .object({
      fullName: z.string(),
    })
    .nullish(),
  thumbnailImage: z
    .object({
      url: z.string(),
    })
    .nullish(),
  tagCollection: z.object({
    items: z.array(tagSchema),
  }),
  sys: z.object({
    id: z.string(),
  }),
});

export type BlogPost = z.infer<typeof blogSchema>;

function extractTagEntries(fetchResponse: unknown): Tag[] {
  return z
    .object({
      data: z.object({
        tagCollection: z.object({ items: z.array(tagSchema) }),
      }),
    })
    .parse(fetchResponse).data.tagCollection.items;
}

function extractPostEntries(fetchResponse: unknown): BlogPost[] {
  return z
    .object({
      data: z.object({
        blogPostCollection: z.object({ items: z.array(blogSchema) }),
      }),
    })
    .parse(fetchResponse).data.blogPostCollection.items;
}

export async function getAllTags(): Promise<Tag[]> {
  const entries = await fetchGraphQL(
    `query {
      tagCollection{
        items{
          label
          sys {
            id
          }
        }
      }
    }`,
  );

  return extractTagEntries(entries);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await fetchGraphQL(
    `query {
      blogPostCollection(order: publishDate_DESC) {
        items {
          publishDate
          title
          plainTextSummary
          author{
            fullName
          }
          thumbnailImage{
            url
          }
          tagCollection{
            items{
              label
              sys {
                id
              }
            }
          }
          sys {
            id
          }
        }
      }
    }`,
  );

  return extractPostEntries(entries);
}
