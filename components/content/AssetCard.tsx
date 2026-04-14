'use client'

import { useState } from 'react'
import AssetModal from '@/components/ui/AssetModal'

export interface Asset {
  title: string
  description?: string
  category: string
  _createdAt?: string
  file?: { asset?: { url: string; originalFilename?: string } }
  videoUrl?: string
  thumbnail?: object
  copyableText?: string
}

// SVG icons per category — 32×32 rendered inside a 40×40 bordered container
const ICONS: Record<string, JSX.Element> = {
  'Email Template': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <path d="M15 35C15 32.239 17.239 30 20 30H100C102.761 30 105 32.239 105 35V85C105 87.761 102.761 90 100 90H20C17.239 90 15 87.761 15 85V35Z" fill="#E9DBDE" />
      <path d="M60 52.5L15 92.5H105L60 52.5Z" fill="#F55B0D" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20 25H100C105.523 25 110 29.477 110 35V85C110 90.523 105.523 95 100 95H20C14.477 95 10 90.523 10 85V35C10 29.477 14.477 25 20 25ZM15.985 32.02C15.366 32.852 15 33.883 15 35V85C15 86.197 15.421 87.296 16.122 88.157L45.769 61.805L15.985 32.02ZM104.015 32.02L74.231 61.804L103.878 88.157L103.858 88.18C104.572 87.316 105 86.208 105 85V35C105 33.883 104.634 32.852 104.015 32.02ZM70.689 65.346L60 76.035L49.31 65.346L21.603 89.975L19.489 89.974C19.657 89.991 19.827 90 20 90H100L98.425 89.999L70.689 65.346ZM98.425 89.999L21.603 89.975L21.576 89.999H98.425Z" fill="#4B0214" />
    </svg>
  ),
  'Message': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M25 25C22.239 25 20 27.239 20 30V80C20 82.761 22.239 85 25 85H64.016L78.182 94.445V85H95C97.761 85 100 82.761 100 80V30C100 27.239 97.761 25 95 25H25Z" fill="#E9DBDE" />
      <path fillRule="evenodd" clipRule="evenodd" d="M25 85H64.016L78.182 94.445V85H95C97.761 85 100 82.761 100 80V30C100 27.239 97.761 25 95 25H25C22.239 25 20 27.239 20 30V80C20 82.761 22.239 85 25 85ZM95 90H83.182V103.787L62.502 90H25C19.477 90 15 85.523 15 80V30C15 24.477 19.477 20 25 20H95C100.523 20 105 24.477 105 30V80C105 85.523 100.523 90 95 90Z" fill="#4B0214" />
      <path d="M30 47.5H90V42.5H30V47.5Z" fill="#F55B0D" />
      <path d="M90 57.5H30V52.5H90V57.5Z" fill="#F55B0D" />
      <path d="M30 67.5H90V62.5H30V67.5Z" fill="#F55B0D" />
    </svg>
  ),
  'One-Pager': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <path d="M4 3H20V4H4V3Z" fill="#F55B0D"/>
      <path d="M5 5H19V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18V5Z" fill="#E9DBDE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M3 2H21V5H20V18C20 19.1046 19.1046 20 18 20H16.5V22H15.5V20H8.5V22H7.5V20H6C4.89543 20 4 19.1046 4 18V5H3V2ZM5 5H19V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18V5ZM20 4H4V3H20V4ZM7 15.5H11V14.5H7V15.5ZM11 13.5H7V12.5H11V13.5ZM7 17.5H11V16.5H7V17.5ZM12 15.5H13V17.5H12V15.5ZM14 14.5V17.5H15V14.5H14ZM16 17.5V12.5H17V17.5H16ZM17 6.5H14.5V7.5H15.1693L12.4758 9.85682L10.517 8.38775L7.22266 10.584L7.77736 11.416L10.483 9.61225L12.5242 11.1432L16 8.10188V9H17V6.5Z" fill="#4B0214"/>
    </svg>
  ),
  'Video': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <rect x="12.5" y="22.5" width="95" height="75" rx="6.5" fill="#E9DBDE" stroke="#4B0214" strokeWidth="5" />
      <path d="M79.319 59.115L44.466 40.771C43.8 40.421 43 40.904 43 41.656V78.344C43 79.096 43.8 79.579 44.466 79.229L79.319 60.885C80.031 60.51 80.031 59.49 79.319 59.115Z" fill="#F55B0D" stroke="#4B0214" strokeWidth="5" />
    </svg>
  ),
  'Brand': (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <path d="M15 25C15 22.239 17.239 20 20 20H50V45H15V25Z" fill="#F55B0D" />
      <path d="M15 65H50V100H20C17.239 100 15 97.761 15 95V65Z" fill="#E9DBDE" />
      <path d="M70 90H105V95C105 97.761 102.761 100 100 100H70V90Z" fill="#F55B0D" />
      <path fillRule="evenodd" clipRule="evenodd" d="M55 50V15H20C14.477 15 10 19.477 10 25V50H55ZM15 25C15 22.239 17.239 20 20 20H50V45H15V25ZM55 60H10V95C10 100.523 14.477 105 20 105H55V60ZM15 95V65H50V100H20C17.239 100 15 97.761 15 95ZM65 15H100C105.523 15 110 19.477 110 25V75H65V15ZM110 85H65V105H100C105.523 105 110 100.523 110 95V85ZM70 100V90H105V95C105 97.761 102.761 100 100 100H70Z" fill="#4B0214" />
    </svg>
  ),
  'Slide Deck': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <path d="M4 5H20V16H4V5Z" fill="#E9DBDE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7 9.5H12V8.5H7V9.5ZM17 10.5V11.5H7V10.5H17ZM17 12.5V13.5H7V12.5H17Z" fill="#F55B0D"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.43213 3V2H10.4321V3H13.4321V2H14.4321V3H16V4H21V16H22V19H15.0675L16.8841 21.1799L16.1159 21.8201L13.7658 19H12.5V22H11.5V19H10.2342L7.8842 21.8201L7.11597 21.1799L8.93252 19H2V16H3V4H8V3H9.43213ZM8 6V5H4V16H20V5H16V6H8Z" fill="#4B0214"/>
    </svg>
  ),
}

const COPY_CATEGORIES = new Set(['Email Template', 'Message'])

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AssetCard({ asset }: { asset: Asset }) {
  const { title, description, category, _createdAt, file, videoUrl, thumbnail, copyableText } = asset
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isCopy = COPY_CATEGORIES.has(category)
  const fileUrl = file?.asset?.url ?? null
  const formattedDate = _createdAt ? formatDate(_createdAt) : ''

  function handleCopy() {
    if (!copyableText) return
    navigator.clipboard.writeText(copyableText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-[#E5E0D8] rounded-xl p-5 flex flex-col gap-[14px] min-h-[215px] cursor-pointer hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* Top row: icon + type badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            border: '1px solid #E5E0D8',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {ICONS[category] ?? ICONS['Brand']}
          </div>
          <div style={{
            backgroundColor: '#F0EBE3',
            borderRadius: 999,
            padding: '4px 10px',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: '#4B0214',
              lineHeight: '12px',
            }}>
              {category}
            </span>
          </div>
        </div>

        {/* Body: title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: '#1C1917',
            lineHeight: '1.3',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {title}
          </div>
          {description && (
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 12,
              color: '#6E6D6C',
              lineHeight: '1.5',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}>
              {description}
            </div>
          )}
        </div>

        {/* Footer: date + action button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F0EBE3',
          paddingTop: 12,
        }}>
          <span style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 11,
            color: '#C4BDB4',
            lineHeight: '14px',
            flexShrink: 0,
          }}>
            {formattedDate}
          </span>

          <div onClick={e => e.stopPropagation()}>
            {isCopy && copyableText ? (
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #1C1917',
                  borderRadius: 999,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#1C1917',
                  lineHeight: '14px',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {copied ? 'Copied!' : '↓ Copy'}
              </button>
            ) : fileUrl ? (
              <a
                href={fileUrl}
                download
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #1C1917',
                  borderRadius: 999,
                  padding: '6px 14px',
                  textDecoration: 'none',
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#1C1917',
                  lineHeight: '14px',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                ↓ Download
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        category={category}
        date={formattedDate}
        fileUrl={fileUrl}
        videoUrl={videoUrl ?? null}
        thumbnail={thumbnail}
        copyableText={copyableText ?? null}
      />
    </>
  )
}
