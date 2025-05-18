'use client'

import { ProtectedLayout } from '@/app/components/ProtectedLayout'
import { useEffect, useState } from 'react'

interface Statement {
  id: string
  amount: number
  type: 'credit' | 'debit'
  reason: string
  createdAt: string
  person: {
    name: string
    phone: string
  }
}

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [totalCount, setTotalCount] = useState(0)
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')

  useEffect(() => {
    async function fetchStatements() {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (searchName) params.append('name', searchName)
      if (searchPhone) params.append('phone', searchPhone)

      const res = await fetch(`/api/statement?${params.toString()}`)
      const data = await res.json()
      setStatements(data.data)
      setTotalCount(data.totalCount)
      setLoading(false)
    }

    fetchStatements()
  }, [page, limit, searchName, searchPhone])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <ProtectedLayout>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Extrato de Indicações</h1>

        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => {
                setPage(1)
                setSearchName(e.target.value)
              }}
              className="border rounded px-3 py-1 w-48"
              placeholder="Buscar por nome"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => {
                setPage(1)
                setSearchPhone(e.target.value)
              }}
              className="border rounded px-3 py-1 w-48"
              placeholder="Buscar por telefone"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-md mb-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Pessoa</th>
                    <th className="px-4 py-2">Telefone</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {statements.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-4 py-2">
                        {new Date(s.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-2">{s.person.name}</td>
                      <td className="px-4 py-2">{s.person.phone}</td>
                      <td className="px-4 py-2 capitalize text-gray-700">
                        {s.type === 'credit' ? 'Crédito' : 'Débito'}
                      </td>
                      <td className={`px-4 py-2 ${s.type === 'credit' ? 'text-green-700' : 'text-red-600'}`}>
                        R$ {s.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center gap-4">
              <label className="text-sm">
                Exibir:
                <select
                  className="ml-2 border rounded-md px-2 py-1"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  {[50, 100, 200, 500].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm">Página {page} de {totalPages}</span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedLayout>
  )
}
