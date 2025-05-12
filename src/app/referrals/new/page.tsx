'use client'

import { Button } from '@/app/components/Button'
import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewReferralPage() {
//   const router = useRouter()

  const [referrerPhone, setReferrerPhone] = useState('')
  const [referrerName, setReferrerName] = useState('')
  const [referredPhone, setReferredPhone] = useState('')
  const [referredName, setReferredName] = useState('')
  const [procedure, setProcedure] = useState('')
  const [planValue, setPlanValue] = useState('')
  const [commissionValue, setCommissionValue] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchPerson = async (phone: string, setName: (n: string) => void) => {
    const res = await fetch(`/api/people?phone=${phone}`)
    if (res.ok) {
      const data = await res.json()
      setName(data.name)
    } else {
      setName('')
    }
  }

  useEffect(() => {
    if (referrerPhone && referredPhone && referrerPhone === referredPhone) {
      setError('O telefone de quem indicou não pode ser igual ao da pessoa indicada.')
    } else {
      setError('')
    }
  }, [referrerPhone, referredPhone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
  
    if (referrerPhone === referredPhone) {
      setError('O telefone de quem indicou não pode ser igual ao da pessoa indicada.')
      return
    }
  
    const res = await fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        referrerPhone,
        referrerName,
        referredPhone,
        referredName,
        procedure,
        planValue: Number(planValue)
      })
    })
  
    if (res.ok) {
      setSuccess('Indicação registrada com sucesso!')
      setReferrerPhone('')
      setReferrerName('')
      setReferredPhone('')
      setReferredName('')
      setProcedure('')
      setPlanValue('')
      setCommissionValue('')
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao registrar indicação')
    }
  }
  

  const updateCommission = (value: string) => {
    setPlanValue(value)
    const num = parseFloat(value)
    if (!isNaN(num)) {
      const commission = (num * 0.05).toFixed(2)
      setCommissionValue(commission)
    } else {
      setCommissionValue('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow">
      <h1 className="text-2xl font-bold mb-4">Nova Indicação</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Referrer */}
        <div>
          <label className="block text-sm">Telefone de quem indicou</label>
          <input
            type="text"
            value={referrerPhone}
            onChange={e => setReferrerPhone(e.target.value)}
            onBlur={() => fetchPerson(referrerPhone, setReferrerName)}
            className="w-full border p-2 rounded-md"
            required
          />
          {referrerName ? (
            <p className="text-sm text-gray-600">Nome: {referrerName}</p>
          ) : (
            <input
              type="text"
              placeholder="Nome de quem indicou"
              value={referrerName}
              onChange={e => setReferrerName(e.target.value)}
              className="w-full mt-2 border p-2 rounded-md"
              required
            />
          )}
        </div>

        {/* Referred */}
        <div>
          <label className="block text-sm">Telefone da pessoa indicada</label>
          <input
            type="text"
            value={referredPhone}
            onChange={e => setReferredPhone(e.target.value)}
            onBlur={() => fetchPerson(referredPhone, setReferredName)}
            className="w-full border p-2 rounded-md"
            required
          />
          {referredName ? (
            <p className="text-sm text-gray-600">Nome: {referredName}</p>
          ) : (
            <input
              type="text"
              placeholder="Nome da pessoa indicada"
              value={referredName}
              onChange={e => setReferredName(e.target.value)}
              className="w-full mt-2 border p-2 rounded-md"
              required
            />
          )}
        </div>

        {/* Procedure */}
        <div>
          <label className="block text-sm">Procedimento</label>
          <input
            type="text"
            value={procedure}
            onChange={e => setProcedure(e.target.value)}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        {/* Plan Value */}
        <div>
          <label className="block text-sm">Valor do Plano</label>
          <input
            type="number"
            step="0.01"
            value={planValue}
            onChange={e => updateCommission(e.target.value)}
            className="w-full border p-2 rounded-md"
            required
          />
          {commissionValue && (
            <p className="text-sm text-green-600 mt-1">
              Comissão (5%): R$ {commissionValue}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="flex min-h-screen">
              <Button onClick={() => console.log('Button clicked')}>Click Me</Button>
            </div>

        <button
          type="submit"
          disabled={!!error}
          className="bg-linear-45 from-indigo-500 via-purple-500 to-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        //   w-full bg-primary py-2 rounded-md hover:opacity-90 transition
        //   bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full
        >
          Registrar Indicação
        </button>
      </form>
    </div>
  )
}
