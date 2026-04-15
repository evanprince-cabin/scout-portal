'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

interface Props {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="border-b border-cabin-stone/15 pb-3">
            <div
              className="flex items-center gap-4 cursor-pointer select-none py-2"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${isOpen ? 'bg-cabin-mauve/80' : 'bg-cabin-mauve'}`}>
                {isOpen
                  ? <Minus size={16} className="text-cabin-maroon" />
                  : <Plus  size={16} className="text-cabin-maroon" />
                }
              </div>
              <span className="font-geist font-medium text-cabin-charcoal text-lg">
                {item.question}
              </span>
            </div>
            {isOpen && (
              <div className="pl-12 pb-3 transition-all duration-200">
                <p className="font-inter text-base text-cabin-stone leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
