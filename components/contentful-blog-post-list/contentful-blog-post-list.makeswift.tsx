import { Combobox, Number, Style, TextInput } from '@makeswift/runtime/controls';
import { forwardNextDynamicRef } from '@makeswift/runtime/next';
import dynamic from 'next/dynamic';
import { z } from 'zod';

import { tagSchema } from '~/lib/contenful/api';
import { runtime } from '~/lib/makeswift/runtime';

export const props = {
  className: Style({ properties: [Style.Margin, Style.Padding, Style.Width] }),
  title: TextInput({ label: 'Title' }),
  limit: Number({ label: 'Limit' }),
  tag: Combobox({
    label: 'Tag',
    async getOptions(query) {
      const response = await fetch('/api/contentful/tags');
      const body: unknown = await response.json();
      const tags = z.object({ tags: z.array(tagSchema) }).parse(body).tags;

      return tags
        .map((tag) => ({
          id: tag.sys.id,
          label: tag.label,
          value: tag,
        }))
        .filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
    },
  }),
};

runtime.registerComponent(
  forwardNextDynamicRef((patch) =>
    dynamic(() =>
      patch(
        import('./contentful-blog-post-list').then(
          ({ ContentfulBlogPostList }) => ContentfulBlogPostList,
        ),
      ),
    ),
  ),
  {
    type: 'contentful-blog-post-list',
    label: 'Contentful Blog Post List',
    props,
  },
);
