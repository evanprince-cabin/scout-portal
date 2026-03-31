interface StatCardProps {
  label: string
  value: number
  icon?: React.ReactNode
}

export default function StatCard({ label, value, icon }: StatCardProps) {
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
