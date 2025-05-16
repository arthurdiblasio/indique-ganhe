'use client'

import { InputHTMLAttributes } from 'react'

interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string, numeric: number) => void
  label?: string
}

export function MoneyInput({
  value,
  onChange,
  onBlur,
  label,
  className,
  ...props
}: MoneyInputProps) {
  const formatCurrency = (v: string) => {
    const num = Number(v.replace(/\D/g, '')) / 100
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueOnlyNumbers = e.target.value.replace(/\D/g, '')
    const valurCurrency = formatCurrency(valueOnlyNumbers)
    const valueInCents = Number(valueOnlyNumbers) / 100
    onChange(valurCurrency, valueInCents)
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        {...props}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder="R$ 0,00"
        className={`w-full border p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${className ?? ''}`}
      />
    </div>
  )
}
