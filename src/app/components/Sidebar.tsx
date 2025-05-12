'use client'

import { useRouter } from 'next/navigation'

export function Sidebar() {
  const router = useRouter()

  const handleLogout = () => {
    // Remove o cookie manualmente
    document.cookie = 'token=; Max-Age=0; path=/'

    // Redireciona para login
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-100 p-6 flex flex-col justify-between border-r border-gray-200">
      <nav className="space-y-4">
        <h2 className="text-xl font-bold text-primary mb-4">Menu</h2>
        <a href="/dashboard" className="block text-gray-700 hover:text-primary">Dashboard</a>
        <a href="/referrals/new" className="block text-gray-700 hover:text-primary">Nova Indicação</a>
        <a href="/clientes" className="block text-gray-700 hover:text-primary">Nova Cliente</a>
      </nav>

      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:underline mt-10"
      >
        Sair
      </button>
    </aside>
  )
}
