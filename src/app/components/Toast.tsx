'use client'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
}

const color = {
  'success': 'bg-green-600',
  'error': 'bg-red-600',
  'info': 'bg-yellow-600',
}

export function Toast({ message, type }: ToastProps) {
  const bgColor = color[type] || 'bg-gray-800'

  return (
    <div className={`${bgColor} fixed bottom-4 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-md shadow z-50 animate-fade-in`}>
      {message}
    </div>
  )
}
