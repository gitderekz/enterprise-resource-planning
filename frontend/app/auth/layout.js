'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({ children }) {
  // Optional: Add auth redirect logic here if needed
  return (
    <div className="min-h-screen bg-purple-900 flex items-center justify-center">
      {children}
    </div>
  )
}