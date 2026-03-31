interface StatCardProps {
  label: string
  value: number
  icon?: React.ReactNode
  compact?: boolean
}

export default function StatCard({ label, value, icon, compact }: StatCardProps) {
  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-cabin-stone/20">
        <p className="text-2xl font-geist font-bold text-cabin-maroon">{value}</p>
        <p className="mt-0.5 text-xs font-inter text-cabin-stone">{label}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-cabin-stone/20 relative">
      {icon && (
        <div className="absolute top-6 right-6 text-cabin-stone opacity-40">
          {icon}
        </div>
      )}
      <p className="text-4xl font-geist font-bold text-cabin-maroon">{value}</p>
      <p className="mt-1 text-sm font-inter text-cabin-stone">{label}</p>
    </div>
  )
}
