import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { report } from './sanity/schemas/report'
import { article } from './sanity/schemas/article'
import { playbookPage } from './sanity/schemas/playbookPage'
import { asset } from './sanity/schemas/asset'
import { event } from './sanity/schemas/event'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  title: 'Cabin Scout Portal',
  schema: {
    types: [report, article, playbookPage, asset, event],
  },
  plugins: [structureTool()],
})
