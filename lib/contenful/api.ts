async function fetchGraphQL(query: string): Promise<any> {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    },
  ).then((response) => response.json());
}

export type Tag = {
  label: string;
  sys: {
    id: string;
  };
};

export type BlogPost = {
  title: string;
  publishDate: string;
  plainTextSummary?: string;
  author?: {
    fullName: string;
  };
  thumbnailImage?: {
    url: string;
  };
  tagCollection: { items: Tag[] };
  sys: {
    id: string;
  };
};

function extractTagEntries(fetchResponse: any): Tag[] {
  try {
    return fetchResponse?.data?.tagCollection?.items;
  } catch (e) {
    throw new Error(`Failed to parse Contentful data with: ${e}`);
  }
}

function extractPostEntries(fetchResponse: any): BlogPost[] {
  try {
    return fetchResponse?.data?.blogPostCollection?.items;
  } catch (e) {
    throw new Error(`Failed to parse Contentful data with: ${e}`);
  }
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
  console.log('tag entries', entries);
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
