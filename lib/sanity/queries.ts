import { sanityClient } from './client'

export async function getDashboardData() {
  return sanityClient.fetch(`{
    "latestReport": *[_type == "report"] | order(publishedDate desc) [0] {
      title, slug, publishedDate, summary, coverImage
    },
    "recentArticles": *[_type == "article"] | order(publishedDate desc) [0..2] {
      title, slug, publishedDate, category, summary, coverImage
    },
    "upcomingEvents": *[_type == "event" && featured == true && date > now()] | order(date asc) [0..1] {
      title, slug, date, eventType, location, registrationUrl, summary
    }
  }`)
}

export async function getAllReports() {
  return sanityClient.fetch(`*[_type == "report"] | order(publishedDate desc) {
    title, slug, publishedDate, coverImage, summary
  }`)
}

export async function getReportBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "report" && slug.current == $slug][0] {
      title, slug, publishedDate, coverImage, summary, body, pdfDownload
    }`,
    { slug }
  )
}

export async function getAllArticles(category?: string) {
  if (category) {
    return sanityClient.fetch(
      `*[_type == "article" && category == $category] | order(publishedDate desc) {
        title, slug, publishedDate, category, summary, coverImage, featured
      }`,
      { category }
    )
  }
  return sanityClient.fetch(`*[_type == "article"] | order(publishedDate desc) {
    title, slug, publishedDate, category, summary, coverImage, featured
  }`)
}

export async function getArticleBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      title, slug, publishedDate, category, summary, coverImage, body, featured
    }`,
    { slug }
  )
}

export async function getAllPlaybookPages() {
  return sanityClient.fetch(`*[_type == "playbookPage"] | order(section asc, order asc) {
    title, slug, section, order
  }`)
}

export async function getPlaybookPageBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "playbookPage" && slug.current == $slug][0] {
      title, slug, section, body, order
    }`,
    { slug }
  )
}

export async function getAllAssets(category?: string) {
  if (category) {
    return sanityClient.fetch(
      `*[_type == "asset" && category == $category] {
        title, description, category, file, videoUrl, thumbnail, copyableText
      }`,
      { category }
    )
  }
  return sanityClient.fetch(`*[_type == "asset"] {
    title, description, category, file, videoUrl, thumbnail, copyableText
  }`)
}

export async function getAllEvents() {
  return sanityClient.fetch(`{
    "upcoming": *[_type == "event" && date > now()] | order(date asc) {
      title, slug, date, endDate, eventType, location, registrationUrl, coverImage, summary, featured
    },
    "past": *[_type == "event" && date <= now()] | order(date desc) {
      title, slug, date, endDate, eventType, location, registrationUrl, coverImage, summary, featured
    }
  }`)
}

export async function getEventBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "event" && slug.current == $slug][0] {
      title, slug, eventType, date, endDate, location, registrationUrl, coverImage, summary, body, featured
    }`,
    { slug }
  )
}
