'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

const sections = ['Pitching', 'ICP', 'Objections', 'FAQ', 'Competitive']

export default function PlaybookPage() {
  const [activeSection, setActiveSection] = useState('Pitching')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Playbook</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Everything you need to pitch and close deals with Cabin.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Section nav — desktop sidebar */}
        <aside className="hidden md:block w-48 flex-shrink-0">
          <Card hover={false} className="p-3">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-full text-sm font-inter font-medium
                    transition-colors duration-150
                    ${activeSection === section
                      ? 'bg-cabin-maroon text-white'
                      : 'text-cabin-stone hover:bg-cabin-mauve hover:text-cabin-charcoal'
                    }
                  `}
                >
                  {section}
                </button>
              ))}
            </nav>
          </Card>
        </aside>

        {/* Mobile section dropdown */}
        <div className="md:hidden w-full">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full rounded-full px-4 py-2.5 text-sm font-inter border border-cabin-stone/30 bg-white text-cabin-charcoal focus:outline-none focus:border-cabin-maroon"
          >
            {sections.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Content area */}
        <Card className="flex-1">
          <div className="mb-4">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
      </div>
    </div>
  )
}
