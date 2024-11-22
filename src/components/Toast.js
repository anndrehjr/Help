import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up">
      <CheckCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  )
}

