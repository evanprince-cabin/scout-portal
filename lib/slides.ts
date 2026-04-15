/**
 * Extracts the presentation ID from a Google Slides share URL and returns
 * a thumbnail URL via the Google Drive thumbnail API.
 *
 * Returns null if the URL doesn't match the Google Slides /d/{id} pattern.
 */
export function getSlidesThumbnailUrl(resourceUrl: string): string | null {
  const match = resourceUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return null
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1280`
}
