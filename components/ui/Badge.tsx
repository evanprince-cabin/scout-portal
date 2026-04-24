type BadgeVariant =
  | 'strategy'
  | 'engineering'
  | 'design'
  | 'ai'
  | 'salesforce'
  | 'webinar'
  | 'in-person'
  | 'workshop'
  | 'conference'
  | 'brand'
  | 'one-pager'
  | 'email-template'
  | 'case-study'
  | 'video'
  | 'featured'
  | 'stone'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  strategy:         'bg-blue-50 text-blue-600',
  engineering:      'bg-violet-50 text-violet-600',
  design:           'bg-pink-50 text-pink-600',
  ai:               'bg-orange-50 text-orange-600',
  salesforce:       'bg-cyan-50 text-cyan-600',
  webinar:          'bg-green-50 text-green-700',
  'in-person':      'bg-cabin-linen text-cabin-stone',
  workshop:         'bg-amber-50 text-amber-700',
  conference:       'bg-indigo-50 text-indigo-600',
  brand:            'bg-yellow-50 text-yellow-700',
  'one-pager':      'bg-red-50 text-red-600',
  'email-template': 'bg-teal-50 text-teal-600',
  'case-study':     'bg-purple-50 text-purple-600',
  video:            'bg-rose-50 text-rose-600',
  featured:         'bg-amber-50 text-amber-700',
  stone:            'bg-stone-100 text-stone-600',
}

export default function Badge({ variant = 'stone', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
