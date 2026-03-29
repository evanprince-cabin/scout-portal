import dynamic from 'next/dynamic'

export { metadata, viewport } from 'next-sanity/studio'

const Studio = dynamic(() => import('./Studio'), { ssr: false })

export default function StudioPage() {
  return <Studio />
}
