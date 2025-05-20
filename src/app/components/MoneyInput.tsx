'use client'

import { InputHTMLAttributes } from 'react'

interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string, numeric: number) => void
  label?: string
  max?: number // valor numérico máximo permitido
}

export function MoneyInput({
  value,
  onChange,
  onBlur,
  label,
  max,
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
    let valueInCents = Number(valueOnlyNumbers) / 100

    if (max && valueInCents > max) {
      valueInCents = max
    }

    const formatted = formatCurrency((valueInCents * 100).toString())
    onChange(formatted, valueInCents)
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
