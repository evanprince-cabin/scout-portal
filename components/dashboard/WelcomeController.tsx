'use client'

import { useState } from 'react'
import WelcomeModal from '@/components/ui/WelcomeModal'

export default function WelcomeController({ show }: { show: boolean }) {
  const [isOpen, setIsOpen] = useState(show)
  return <WelcomeModal isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
}
