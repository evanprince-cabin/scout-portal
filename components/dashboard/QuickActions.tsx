import Link from 'next/link'
import { Send, FolderOpen, FileText } from 'lucide-react'

interface QuickActionsProps {
  latestReportSlug: string | null
}

const actions = (slug: string | null) => [
  {
    icon: Send,
    iconColor: 'text-cabin-flame',
    iconBg: 'bg-cabin-flame/10',
    title: 'Send a Referral',
    description: 'Refer a new prospect to Cabin',
    href: '/referrals',
  },
  {
    icon: FolderOpen,
    iconColor: 'text-cabin-indigo',
    iconBg: 'bg-cabin-sky',
    title: 'Find an Asset',
    description: 'Browse sales tools and templates',
    href: '/assets',
  },
  {
    icon: FileText,
    iconColor: 'text-cabin-grass',
    iconBg: 'bg-cabin-lime',
    title: 'Read Latest Report',
    description: "Read Cabin's most recent field report",
    href: slug ? `/reports/${slug}` : '/reports',
  },
]

export default function QuickActions({ latestReportSlug }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions(latestReportSlug).map(({ icon: Icon, iconColor, iconBg, title, description, href }) => (
        <Link
          key={href}
          href={href}
          className="bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-3 flex items-center gap-4 hover:shadow-md hover:border-cabin-stone/40 hover:-translate-y-0.5 transition-all duration-150"
        >
          <div className={`flex-shrink-0 ${iconBg} p-3.5 rounded-lg`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <p className="font-geist font-semibold text-base text-cabin-charcoal">{title}</p>
            <p className="font-inter text-sm text-cabin-stone mt-0.5">{description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
