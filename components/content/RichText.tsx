import { PortableText } from '@portabletext/react'

const components = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-inter text-cabin-charcoal leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-geist font-bold text-2xl text-cabin-charcoal mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-geist font-semibold text-xl text-cabin-charcoal mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-geist font-semibold text-lg text-cabin-charcoal mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-cabin-flame pl-5 italic text-cabin-stone my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-cabin-charcoal">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-cabin-maroon underline hover:text-cabin-charcoal transition-colors duration-150"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside ml-5 mb-4 space-y-1 font-inter text-cabin-charcoal">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 font-inter text-cabin-charcoal">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
}

interface RichTextProps {
  value: any[]
  className?: string
}

export default function RichText({ value, className = '' }: RichTextProps) {
  if (!value?.length) return null
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
