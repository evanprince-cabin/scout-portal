import { defineField, defineType } from 'sanity'

export const asset = defineType({
  name: 'asset',
  title: 'Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Email Template', value: 'Email Template' },
          { title: 'Message', value: 'Message' },
          { title: 'One-Pager', value: 'One-Pager' },
          { title: 'Slide Deck', value: 'Slide Deck' },
          { title: 'Video', value: 'Video' },
          { title: 'Brand', value: 'Brand' },
        ],
      },
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'copyableText',
      title: 'Copyable Text',
      type: 'text',
    }),
    defineField({
      name: 'popular',
      title: 'Popular with teammates',
      type: 'boolean',
      description: "Show a \"Popular with teammates\" tag on this item's favorite card",
      initialValue: false,
    }),
  ],
})
