'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'
import { getReports } from '@/lib/sanity/queries'

interface Report {
  _id: string
  title: string
  slug: { current: string }
  publishedDate?: string
  quarter?: string
  year?: number
  summary?: string
  pdfDownload?: { asset?: { url?: string } }
}

interface YearGroup {
  year: number
  reports: Report[]
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ReportsPage() {
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([])
  const [openYears, setOpenYears] = useState<Record<number, boolean>>({})

  useEffect(() => {
    getReports()
      .then((reports: Report[]) => {
        const grouped: Record<number, Report[]> = {}
        for (const report of reports) {
          const y = report.year ?? 0
          if (!grouped[y]) grouped[y] = []
          grouped[y].push(report)
        }
        const groups: YearGroup[] = Object.entries(grouped)
          .map(([y, rs]) => ({ year: Number(y), reports: rs }))
          .sort((a, b) => b.year - a.year)

        setYearGroups(groups)
        if (groups.length > 0) {
          setOpenYears({ [groups[0].year]: true })
        }
      })
      .catch(() => {})
  }, [])

  function toggleYear(year: number) {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }))
  }

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">Reports</h1>
        <p className="mt-1 font-inter text-cabin-stone text-sm">
          Stay up to date on Cabin&apos;s growth, clients, and company landscape.
        </p>
      </div>

      <div className="space-y-4">
        {yearGroups.map(({ year, reports }) => {
          const isOpen = !!openYears[year]
          return (
            <div key={year} className="bg-[#F6F6F7] rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
                onClick={() => toggleYear(year)}
              >
                <span className="font-geist font-bold text-2xl text-cabin-maroon tracking-tight">
                  {year}
                </span>
                {isOpen ? (
                  <ChevronUp size={20} className="text-[#515151] flex-shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-[#515151] flex-shrink-0" />
                )}
              </div>

              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                    {reports.map((report) => (
                      <Link
                        key={report._id}
                        href={`/reports/${report.slug.current}`}
                        className="bg-white rounded-[14px] border border-cabin-stone/20 border-l-2 border-l-cabin-flame p-5 flex flex-col gap-2 min-h-[140px] hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div>
                          <span className="font-geist font-bold text-[32px] text-cabin-flame leading-[40px] tracking-[0.5px]">
                            {report.quarter}
                          </span>
                        </div>
                        <div>
                          <p className="font-inter text-sm font-medium text-cabin-charcoal leading-snug line-clamp-2">
                            {report.title}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-inter text-[11px] text-[#B0ABA6] leading-[14px]">
                            {formatDate(report.publishedDate)}
                          </span>
                          {report.pdfDownload?.asset?.url && (
                            <a
                              href={report.pdfDownload.asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] font-inter font-semibold text-cabin-stone hover:text-cabin-maroon transition-colors duration-150"
                            >
                              <Download size={12} />
                              PDF
                            </a>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
