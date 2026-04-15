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
      name: 'faq',
      title: 'FAQ Items',
      description: 'Used only for FAQ section pages — add each question and answer as a separate item',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer',   title: 'Answer',   type: 'text',   validation: (Rule) => Rule.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: 'format',
      title: 'Page Format',
      type: 'string',
      description: 'Choose "Pitching Resource" for link-forward pages with a CTA, TLDR, and When to Use section. Leave as "Long-form" for FAQ and other rich-text pages.',
      options: {
        list: [
          { title: 'Long-form (default)', value: 'longform' },
          { title: 'Pitching Resource',   value: 'pitching-resource' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short intro paragraph (2–3 sentences). Only used when format is "Pitching Resource".',
      rows: 3,
    }),
    defineField({
      name: 'resourceUrl',
      title: 'Resource URL',
      type: 'url',
      description: 'External link for the CTA button. Leave blank until the resource is ready.',
    }),
    defineField({
      name: 'resourceLabel',
      title: 'Resource Label',
      type: 'string',
      description: 'CTA button label (e.g. "View Presentation"). Defaults to "View Presentation" if left blank.',
    }),
    defineField({
      name: 'tldr',
      title: 'TLDR Bullets',
      type: 'array',
      of: [{ type: 'string' }],
      description: '4–6 key takeaways. Only used when format is "Pitching Resource".',
    }),
    defineField({
      name: 'whenToUse',
      title: 'When to Use This',
      type: 'string',
      description: 'One sentence. Only used when format is "Pitching Resource".',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
})
