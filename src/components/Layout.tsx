'use client'

import React, { useState } from 'react'
import { Menu, X, Moon, Sun, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useAuthStore } from '@/store/useAuthStore'
import SettingsPanel from '@/components/SettingsPanel'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const pathname = usePathname()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '🎤', label: 'Speaking',  href: '/speaking'  },
    { icon: '👂', label: 'Listening', href: '/listening' },
    { icon: '📖', label: 'Reading',   href: '/reading'   },
    { icon: '✍️', label: 'Writing',   href: '/writing'   },
    { icon: '📚', label: 'Vocabulary',href: '/vocabulary'},
    { icon: '🎨', label: 'Flashcards',href: '/flashcards'},
    { icon: '🤖', label: 'AI Tutor',  href: '/tutor'     },
  ]

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/auth'
  }

  return (
    <div className={clsx('flex h-screen bg-gray-50 dark:bg-dark-900', darkMode && 'dark')}>
      {/* Sidebar */}
      <aside
        className={clsx(
          'bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              EC
            </div>
            {sidebarOpen && (
              <span className="font-bold text-gray-900 dark:text-white truncate">EnglishCanvas</span>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                )}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-3 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
          >
            {darkMode ? <Sun size={20} className="flex-shrink-0" /> : <Moon size={20} className="flex-shrink-0" />}
            {sidebarOpen && <span className="font-medium">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Right side: user + icons */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role === 'student' ? '📚 Aluno' : user.role === 'teacher' ? '👨‍🏫 Professor' : '🔐 Admin'} · {user.level}
                    </p>
                  </div>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                    onClick={() => setSettingsOpen(true)}
                    title="Ver perfil"
                  />
                </div>
              )}

              {/* Settings */}
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Configurações"
                title="Configurações"
              >
                <Settings size={20} />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Sair"
                title="Sair da conta"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    </div>
  )
}

export default Layout
