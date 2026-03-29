interface EmptyStateProps {
  icon?: React.ReactNode
  heading: string
  subtext?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, heading, subtext, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="mb-4 text-cabin-stone opacity-40">
          {icon}
        </div>
      )}
      <h3 className="font-geist font-semibold text-cabin-charcoal text-lg mb-2">
        {heading}
      </h3>
      {subtext && (
        <p className="font-inter text-cabin-stone text-sm max-w-sm">
          {subtext}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
