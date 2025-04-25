"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import "../components/Toast.css"

function Toast({ message, onClose }) {
  const [progress, setProgress] = useState(100)
  const duration = 3000 // 3 seconds
  const updateInterval = 10 // Update every 10ms

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(progressInterval)
          onClose()
          return 0
        }
        return prevProgress - (100 * updateInterval) / duration
      })
    }, updateInterval)

    return () => clearInterval(progressInterval)
  }, [onClose])

  return (
    <div className="toast-container">
      <div className="toast-content">
        <Check className="check-icon" size={20} />
        <span>{message}</span>
      </div>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}

export default Toast
