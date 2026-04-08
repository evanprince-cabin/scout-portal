import { defineField, defineType } from 'sanity'

export const report = defineType({
  name: 'report',
  title: 'Report',
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
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'quarter',
      title: 'Quarter',
      type: 'string',
      options: {
        list: [
          { title: 'Q1', value: 'Q1' },
          { title: 'Q2', value: 'Q2' },
          { title: 'Q3', value: 'Q3' },
          { title: 'Q4', value: 'Q4' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'The calendar year this report covers (e.g. 2026)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pdfDownload',
      title: 'PDF Download',
      type: 'file',
    }),
  ],
})
