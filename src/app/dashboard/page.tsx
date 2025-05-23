'use client'

import { useEffect, useState } from 'react'
import { PlusCircle, UserPlus, Wallet } from 'lucide-react'
import { ProtectedLayout } from '../components/ProtectedLayout'
import { formatPhone } from '@/utils/formatters'
import { useRouter } from 'next/navigation'

interface TopPerson {
  id: string
  name: string
  phone: string
  balance: number
}

interface UpcomingExpiration {
  id: string
  procedure: string
  expiresIn: string
  person: {
    name: string
    phone: string
  }
}

interface Partner {
  id: string
  name: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [topPeople, setTopPeople] = useState<TopPerson[]>([])
  const [expiringIndications, setExpiringIndications] = useState<UpcomingExpiration[]>([])
  const [partner, setPartner] = useState<Partner>()

  useEffect(() => {
    async function fetchData() {
      await getTopPeople(setTopPeople).catch(console.error)
      await getPartner(setPartner).catch(console.error)
      await getExpiringIndications(setExpiringIndications).catch(console.error)
    }

    fetchData()
  }, [])

  return (
    <ProtectedLayout>
      <div className="mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Olá {partner?.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div
            onClick={() => router.push('/referrals/new')}
            className="cursor-pointer bg-cyan-800 text-white rounded-md p-6 text-center hover:bg-cyan-900 transition transform hover:scale-105 shadow-md flex flex-col items-center gap-2"
          >
            <PlusCircle size={32} />
            <span>Registrar Indicação</span>
          </div>
          <div
            onClick={() => router.push('/balance/use')}
            className="cursor-pointer bg-yellow-600 text-white rounded-md p-6 text-center hover:bg-yellow-700 transition transform hover:scale-105 shadow-md flex flex-col items-center gap-2"
          >
            <Wallet size={32} />
            <span>Registrar Uso de Saldo</span>
          </div>
          <div
            onClick={() => router.push('/people/new')}
            className="cursor-pointer bg-green-700 text-white rounded-md p-6 text-center hover:bg-green-800 transition transform hover:scale-105 shadow-md flex flex-col items-center gap-2"
          >
            <UserPlus size={32} />
            <span>Adicionar Cliente</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Top 10 Clientes com Maior Saldo</h2>
            <ul className="divide-y">
              {topPeople.map((p) => (
                <li key={p.id} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{p.name} - {formatPhone(p.phone)}</span>
                  <span className="font-semibold text-green-700">R$ {p.balance.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Saldos a Vencer</h2>
            <ul className="divide-y">
              {expiringIndications.map((i) => (
                <li key={i.id} className="py-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{i.person.name} ({i.person.phone})</span>
                    <span className="text-sm text-red-600">Expira: {new Date(i.expiresIn).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="text-sm text-gray-500">Procedimento: {i.procedure}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
async function getPartner(setPartner: (partner: Partner) => void) {
  const response = await fetch('/api/partner')
  const partner = await response.json()
  console.log('partner', partner);

  setPartner(partner)
}

async function getExpiringIndications(setExpiringIndications: (expiringIndications: UpcomingExpiration[]) => void) {
  const expiringRes = await fetch('/api/indication/expiring')
  const expiringData = await expiringRes.json()
  setExpiringIndications(expiringData)
}

async function getTopPeople(setTopPeople: (people: TopPerson[]) => void) {
  const topRes = await fetch('/api/people/top-balance')
  const topData = await topRes.json()
  setTopPeople(topData)
}

