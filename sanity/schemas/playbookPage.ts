import { defineField, defineType } from 'sanity'

export const playbookPage = defineType({
  name: 'playbookPage',
  title: 'Playbook Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      options: {
        list: [
          { title: 'Pitching', value: 'Pitching' },
          { title: 'ICP', value: 'ICP' },
          { title: 'Objections', value: 'Objections' },
          { title: 'FAQ', value: 'FAQ' },
          { title: 'Competitive', value: 'Competitive' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
})
