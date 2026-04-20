import { defineField, defineType } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
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
      name: 'client',
      title: 'Client',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Aviation', value: 'Aviation' },
          { title: 'Healthcare', value: 'Healthcare' },
          { title: 'Non-Profit', value: 'Non-Profit' },
          { title: 'Professional Services', value: 'Professional Services' },
          { title: 'Technology', value: 'Technology' },
          { title: 'Retail', value: 'Retail' },
          { title: 'Finance', value: 'Finance' },
          { title: 'Insurance', value: 'Insurance' },
          { title: 'Real Estate', value: 'Real Estate' },
          { title: 'Manufacturing', value: 'Manufacturing' },
          { title: 'Energy & Utilities', value: 'Energy & Utilities' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Strategy & Innovation', value: 'Strategy & Innovation' },
          { title: 'Product Design', value: 'Product Design' },
          { title: 'Software Engineering', value: 'Software Engineering' },
          { title: 'Salesforce & Business Systems', value: 'Salesforce & Business Systems' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'slideUrl',
      title: 'Google Slides URL',
      type: 'url',
      description: 'Paste the share link directly from Google Slides (File → Share → Copy link)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
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
