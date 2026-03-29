import Sidebar from '@/components/layout/Sidebar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cabin-linen">
      <Sidebar />
      <main className="lg:ml-60 pt-16 lg:pt-0 p-4 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
