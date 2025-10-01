import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { StudentDashboard } from './components/dashboard/StudentDashboard'
import { ChatInterface } from './components/chat/ChatInterface'
import { AlumniDiscovery } from './components/discover/AlumniDiscovery'
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfilePage } from './components/profile/ProfilePage';
import Settings from './components/settings/Settings';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/50 dark:from-primary/5 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {authMode === 'login' ? (
            <LoginForm key="login" onToggleMode={() => setAuthMode('register')} />
          ) : (
            <RegisterForm key="register" onToggleMode={() => setAuthMode('login')} />
          )}
        </AnimatePresence>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />
      case 'discover':
        return <AlumniDiscovery />
      case 'chat':
        return <ChatInterface title="Messages" type="chat" />
      case 'faq':
        return <ChatInterface title="AI Career Assistant" type="faq" />
       case 'profile':
        return <ProfilePage />
      case 'settings':
        return <Settings />
      case 'verification':
      case 'analytics':
      case 'moderation':
        return <AdminDashboard />
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onViewChange={setCurrentView} 
        onToggleMobileSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} 
      />
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-8 md:ml-64">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App