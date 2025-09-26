import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Settings, 
  HelpCircle,
  UserCheck,
  Shield,
  User as UserIcon
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth()

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'profile', label: 'Profile', icon: UserIcon },
      { id: 'chat', label: 'Messages', icon: MessageSquare },
    ]

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { id: 'discover', label: 'Find Alumni', icon: Users },
          { id: 'requests', label: 'My Requests', icon: UserCheck },
          { id: 'jobs', label: 'Job Board', icon: Briefcase },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'faq', label: 'Ask AI', icon: HelpCircle },
        ]
      case 'alumni':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: Users },
          { id: 'requests', label: 'Requests', icon: UserCheck },
          { id: 'jobs', label: 'My Postings', icon: Briefcase },
          { id: 'events', label: 'Events', icon: Calendar },
        ]
      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'Users', icon: Users },
          { id: 'verification', label: 'Verification', icon: Shield },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'moderation', label: 'Moderation', icon: Settings },
        ]
      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    currentView === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </motion.button>
              )
            })}
          </nav>
        </div>
      </div>
    </motion.aside>
  )
}