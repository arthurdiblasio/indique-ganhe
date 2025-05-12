import { Sidebar } from '@/app/components/Sidebar'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-background text-foreground">{children}</main>
    </div>
  )
}
