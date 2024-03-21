import { runtime } from '~/lib/makeswift/runtime';
import { Combobox, Style, Number, TextInput } from '@makeswift/runtime/controls';

import { ContentfulBlogPostList } from './contentful-blog-post-list';
import { Tag } from '~/lib/contenful/api';

export const props = {
  className: Style({ properties: [Style.Margin, Style.Width] }),
  title: TextInput({ label: 'Title' }),
  limit: Number({ label: 'Limit' }),
  tag: Combobox({
    label: 'Tag',
    async getOptions(query) {
      const response = await fetch('/api/contentful/tags');

      if (!response.ok) {
        console.error(response.body);
        return [];
      }

      const { tags }: { tags: Tag[] } = await response.json();

      return tags
        ?.map((tag) => ({
          id: tag.sys.id,
          label: tag.label,
          value: tag,
        }))
        .filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
    },
  }),
};

runtime.registerComponent(ContentfulBlogPostList, {
  type: 'contentful-blog-post-list',
  label: 'Contentful Blog Post List',
  props,
});
