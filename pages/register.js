import React from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../src/contexts/AuthContext'
import { RegisterForm } from '../src/components/auth/RegisterForm'
import Head from "next/head";

export default function RegisterPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on user role
      if (user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const handleToggleMode = () => {
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>Register - Alumni Network</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <RegisterForm onToggleMode={handleToggleMode} />
      </div>
    </>
  )
}
