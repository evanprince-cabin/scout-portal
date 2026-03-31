import type { Metadata } from 'next'
import Sidebar from '@/components/layout/Sidebar'
import { ToastProvider } from '@/lib/toast'

export const metadata: Metadata = {
  title: 'Cabin Scout Portal',
  description: 'Your partner portal for submitting referrals, accessing sales materials, and staying connected with Cabin.',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-cabin-linen">
        <Sidebar />
        <main className="lg:ml-60 pt-16 lg:pt-0 p-4 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
