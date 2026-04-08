'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'

const COPY_CATEGORIES = new Set(['Email Template', 'Message'])
const THUMBNAIL_PREVIEW_CATEGORIES = new Set(['One-Pager', 'Brand'])

interface AssetModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  category: string
  date?: string
  fileUrl: string | null
  videoUrl: string | null
  copyableText: string | null
  thumbnail?: object
}

export default function AssetModal({
  isOpen, onClose, title, description, category, date, fileUrl, videoUrl, copyableText, thumbnail,
}: AssetModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!mounted) return null

  function handleCopy() {
    if (!copyableText) return
    navigator.clipboard.writeText(copyableText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const isCopy = COPY_CATEGORIES.has(category)

  function renderPreview() {
    if (isCopy && copyableText) {
      return (
        <div className="bg-cabin-linen rounded-xl p-4 font-inter text-sm text-cabin-charcoal leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
          {copyableText}
        </div>
      )
    }
    if (category === 'Video' && videoUrl) {
      return (
        <iframe
          src={videoUrl}
          className="w-full aspect-video rounded-xl border-0"
          allowFullScreen
        />
      )
    }
    if (THUMBNAIL_PREVIEW_CATEGORIES.has(category)) {
      if (thumbnail) {
        return (
          <Image
            src={urlFor(thumbnail as any)}
            alt={title}
            width={800}
            height={500}
            className="w-full h-auto rounded-xl object-cover"
          />
        )
      }
      return (
        <div className="bg-cabin-linen rounded-xl p-8 flex items-center justify-center font-inter text-sm text-cabin-stone">
          No preview available
        </div>
      )
    }
    return (
      <div className="bg-cabin-linen rounded-xl p-8 flex items-center justify-center font-inter text-sm text-cabin-stone">
        No preview available
      </div>
    )
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cabin-charcoal/80 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center min-w-0">
            {/* Category badge */}
            <div style={{
              backgroundColor: '#F0EBE3',
              borderRadius: 999,
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#4B0214',
                lineHeight: '12px',
              }}>
                {category}
              </span>
            </div>
            <h2 className="font-geist font-semibold text-cabin-charcoal text-lg ml-3 truncate">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-cabin-stone hover:text-cabin-charcoal transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        {description && (
          <p className="px-6 pb-4 font-inter text-sm text-cabin-stone">{description}</p>
        )}

        {/* Divider */}
        <div className="border-t border-cabin-stone/10" />

        {/* Preview section */}
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-3">
            Preview
          </p>
          {renderPreview()}
        </div>

        {/* Divider */}
        <div className="border-t border-cabin-stone/10" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between p-6 pt-4">
          <span className="font-inter text-xs text-cabin-stone">{date ?? ''}</span>

          {isCopy && copyableText ? (
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          ) : fileUrl ? (
            <a
              href={fileUrl}
              download
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
            >
              ↓ Download
            </a>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  )
}
