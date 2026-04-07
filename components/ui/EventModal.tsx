'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { X, Calendar, Clock, MapPin } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import ShareButton from '@/components/ui/ShareButton'
import { urlFor } from '@/lib/sanity/image'

type BadgeVariant = 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:     'webinar',
  'In-Person': 'in-person',
  Workshop:    'workshop',
  Conference:  'conference',
}

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  slug: string
  eventType: string
  date: string
  endDate?: string
  location?: string
  summary?: string
  coverImage?: object
  registrationUrl?: string
}

export default function EventModal({
  isOpen, onClose, title, slug, eventType, date, endDate, location, summary, coverImage, registrationUrl,
}: EventModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  // Mount on open, unmount after exit transition
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      const t = setTimeout(() => {
        setMounted(false)
        onClose()
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const variant = eventTypeVariant[eventType] ?? 'stone'
  const dateObj = new Date(date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const startTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const endTime = endDate
    ? new Date(endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null
  const timeRange = endTime ? `${startTime} – ${endTime}` : startTime
  const locationLabel =
    location && location.trim().toLowerCase() !== 'virtual' && location.trim() !== ''
      ? location
      : 'Virtual'

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4 transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'} bg-cabin-charcoal/80`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        onClick={e => e.stopPropagation()}
      >
        {coverImage && (
          <img
            src={urlFor(coverImage as any)}
            alt={title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Badge variant={variant}>{eventType}</Badge>
            <button
              onClick={onClose}
              className="text-cabin-stone hover:text-cabin-charcoal transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="font-geist font-bold text-xl text-cabin-charcoal mt-2 mb-3">{title}</h2>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-sm font-inter text-cabin-stone">
              <Calendar size={14} className="text-cabin-stone flex-shrink-0" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-inter text-cabin-stone">
              <Clock size={14} className="text-cabin-stone flex-shrink-0" />
              {timeRange}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-inter text-cabin-stone">
              <MapPin size={14} className="text-cabin-stone flex-shrink-0" />
              {locationLabel}
            </div>
          </div>

          <div className="border-t border-cabin-stone/10 mb-4" />

          {summary && (
            <p className="font-inter text-sm text-cabin-stone leading-relaxed mb-6">{summary}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {registrationUrl && (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
              >
                RSVP →
              </a>
            )}
            <Link
              href={`/events/${slug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium border border-cabin-stone/30 text-cabin-stone hover:border-cabin-maroon hover:text-cabin-maroon transition-colors duration-150 whitespace-nowrap"
            >
              View Full Details →
            </Link>
            <ShareButton href={`/events/${slug}`} label="Share" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
