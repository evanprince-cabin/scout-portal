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
        <div className="lg:ml-60 pt-16 lg:pt-0 p-1 lg:p-2 mt-2 mb-2 min-h-screen">
          <main className="bg-[#FDFDFD] rounded-xl lg:rounded-2xl shadow-sm min-h-[calc(100vh-8px)] lg:min-h-[calc(100vh-16px)] p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
