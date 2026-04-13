'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
}

function Dropdown({ value, onChange, options, placeholder }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-inter text-sm border border-cabin-stone/20 rounded-full pl-4 pr-3 py-2 bg-white text-cabin-charcoal focus:outline-none focus:border-cabin-maroon/40 hover:border-cabin-stone/40 transition-colors duration-150"
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={14}
          className={`text-cabin-stone flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-full bg-white border border-cabin-stone/20 rounded-xl shadow-md z-50 overflow-hidden py-1">
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className={`w-full text-left px-4 py-2 font-inter text-sm hover:bg-cabin-mauve/40 transition-colors duration-100 ${!value ? 'text-cabin-charcoal font-medium' : 'text-cabin-stone'}`}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 font-inter text-sm hover:bg-cabin-mauve/40 transition-colors duration-100 ${value === opt ? 'text-cabin-charcoal font-medium' : 'text-cabin-stone'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface CaseStudyFiltersProps {
  industries: string[]
  serviceTypes: string[]
  onIndustryChange: (value: string) => void
  onServiceTypeChange: (value: string) => void
}

export default function CaseStudyFilters({
  industries,
  serviceTypes,
  onIndustryChange,
  onServiceTypeChange,
}: CaseStudyFiltersProps) {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedServiceType, setSelectedServiceType] = useState('')

  function handleIndustryChange(value: string) {
    setSelectedIndustry(value)
    onIndustryChange(value)
  }

  function handleServiceTypeChange(value: string) {
    setSelectedServiceType(value)
    onServiceTypeChange(value)
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Dropdown
        value={selectedIndustry}
        onChange={handleIndustryChange}
        options={industries}
        placeholder="All Industries"
      />
      <Dropdown
        value={selectedServiceType}
        onChange={handleServiceTypeChange}
        options={serviceTypes}
        placeholder="All Service Types"
      />
    </div>
  )
}
