import React from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../src/contexts/AuthContext'
import { LoginForm } from '../src/components/auth/LoginForm'
import Head from "next/head";

export default function LoginPage() {
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
    router.push('/register')
  }

  return (
    <>
      <Head>
        <title>Login - Alumni Network</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoginForm onToggleMode={handleToggleMode} />
      </div>
    </>
  )
}
