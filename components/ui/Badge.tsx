type BadgeVariant = 'maroon' | 'gold' | 'flame' | 'sky' | 'indigo' | 'stone' | 'grass'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  maroon: 'bg-cabin-maroon text-white',
  gold:   'bg-cabin-gold text-cabin-charcoal',
  flame:  'bg-cabin-flame text-white',
  sky:    'bg-cabin-sky text-cabin-charcoal',
  indigo: 'bg-cabin-indigo text-white',
  stone:  'bg-cabin-stone/20 text-cabin-stone',
  grass:  'bg-cabin-grass text-white',
}

export default function Badge({ variant = 'stone', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1
        text-xs font-inter font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
