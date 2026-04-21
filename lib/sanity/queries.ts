import { sanityClient } from './client'

export async function getDashboardData() {
  return sanityClient.fetch(`{
    "latestReport": *[_type == "report"] | order(publishedDate desc) [0] {
      title, slug, publishedDate, quarter, year, summary, coverImage
    },
    "upcomingEvents": *[_type == "event" && featured == true && date > now()] | order(date asc) [0..1] {
      title, slug, date, endDate, eventType, location, registrationUrl, summary, coverImage
    },
    "activityFeed": {
      "reports": *[_type == "report"] | order(_createdAt desc) [0..2] {
        "contentType": "report", title, _createdAt, slug
      },
      "articles": *[_type == "article"] | order(_createdAt desc) [0..2] {
        "contentType": "article", title, _createdAt, slug
      },
      "playbookPages": *[_type == "playbookPage"] | order(_createdAt desc) [0..2] {
        "contentType": "playbookPage", title, _createdAt, slug,
        faq[] { question, answer }
      },
      "assets": *[_type == "asset"] | order(_createdAt desc) [0..2] {
        "contentType": "asset", title, _createdAt
      },
      "events": *[_type == "event"] | order(_createdAt desc) [0..2] {
        "contentType": "event", title, _createdAt, slug
      }
    }
  }`)
}

export async function getAllReports() {
  return sanityClient.fetch(`*[_type == "report"] | order(publishedDate desc) {
    title, slug, publishedDate, coverImage, summary
  }`)
}

export async function getReports() {
  return sanityClient.fetch(`*[_type == "report"] | order(year desc, quarter desc) {
    _id, title, slug, publishedDate, quarter, year, summary, popular,
    pdfDownload { asset-> { url } }
  }`)
}

export async function getReportBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "report" && slug.current == $slug][0] {
      title, slug, publishedDate, coverImage, summary, body,
      pdfDownload { asset-> { url } }
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
    title, slug, section, order, popular
  }`)
}

export async function getPlaybookPageBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "playbookPage" && slug.current == $slug][0] {
      title, slug, section, body, order,
      faq[] { question, answer },
      format, description, resourceUrl, resourceLabel, tldr, whenToUse
    }`,
    { slug }
  )
}

export async function getAllAssets(category?: string) {
  const projection = `{
    _id, title, description, category, copyableText, _createdAt, popular,
    file { asset-> { url, originalFilename } },
    thumbnail
  }`
  if (category) {
    return sanityClient.fetch(
      `*[_type == "asset" && category == $category] ${projection}`,
      { category }
    )
  }
  return sanityClient.fetch(`*[_type == "asset"] ${projection}`)
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

export async function getCaseStudies() {
  return sanityClient.fetch(`*[_type == "caseStudy"] | order(_createdAt desc) {
    _id, title, slug, client, description, industry, serviceType, coverImage, slideUrl, featured, popular
  }`)
}

export async function getFeaturedCaseStudies() {
  return sanityClient.fetch(`*[_type == "caseStudy" && featured == true] | order(_createdAt desc) {
    _id, title, slug, client, description, industry, serviceType, coverImage, slideUrl
  }`)
}
