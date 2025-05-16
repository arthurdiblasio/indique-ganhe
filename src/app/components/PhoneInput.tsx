'use client'

import { InputHTMLAttributes } from 'react'

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  className,
  label,
  ...props
}: PhoneInputProps) {
  const formatPhone = (v: string) => {
    return v
      .replace(/\D/g, '') // remove tudo que não for número
      .replace(/^(\d{2})(\d)/, '($1) $2') // adiciona parênteses no DDD
      .replace(/(\d{5})(\d{1,5})$/, '$1-$2') // adiciona hífen
      .slice(0, 15) // limita para (99) 99999-9999
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    onChange({ ...e, target: { ...e.target, value: formatted } })
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder="(31) 99999-9999"
        className={`w-full border p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${className ?? ''}`}
      />
    </div>
  )
}
