interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl p-6 shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
