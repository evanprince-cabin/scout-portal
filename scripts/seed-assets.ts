/**
 * Seed placeholder assets into Sanity.
 * Run with: npx tsx scripts/seed-assets.ts
 */

import { createClient } from 'next-sanity'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), '.env.local')
const envLines = readFileSync(envPath, 'utf-8').split('\n')
for (const line of envLines) {
  const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
  if (match) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

type AssetDoc = {
  _type: string
  title: string
  category: string
  copyableText?: string
  description?: string
}

const assets: AssetDoc[] = [
  {
    _type: 'asset',
    title: 'Cabin Introduction Email Template',
    category: 'Email Template',
    copyableText:
      'Hi [Name], I wanted to introduce you to Cabin — an AI strategy, design, and product engineering firm based in Charlotte, NC. They work with ambitious companies to build digital products faster and smarter. I think there could be a great fit here. Would you be open to a quick intro call? Happy to connect you directly.',
  },
  {
    _type: 'asset',
    title: 'What We Do — One Pager',
    category: 'One-Pager',
    description: "A single-page overview of Cabin's services and approach",
  },
  {
    _type: 'asset',
    title: 'Cabin LinkedIn Intro Message',
    category: 'Email Template',
    copyableText:
      "Hey [Name] — I've been working with a firm called Cabin that does AI strategy and product engineering. Given what you're building, I thought it might be worth a conversation. Want me to make an intro?",
  },
]

async function seed() {
  console.log('Seeding placeholder assets...\n')

  for (const asset of assets) {
    // Check if an asset with this title already exists
    const existing = await client.fetch(
      `*[_type == "asset" && title == $title][0]._id`,
      { title: asset.title }
    )

    if (existing) {
      console.log(`  SKIP  "${asset.title}" (already exists)`)
      continue
    }

    const doc = await client.create(asset)
    console.log(`  CREATE "${doc.title}" (${doc._id})`)
  }

  console.log('\nDone.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
