'use client'

import React, { useState } from 'react'
import { X, User, Bell, Moon, Sun, Globe, Lock, Trash2, Save } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Button from '@/components/Button'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
const LANGUAGES = ['Português', 'Español', 'Français', 'Deutsch', 'Italiano', 'Other']

const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose, darkMode, onToggleDarkMode }) => {
  const { user, updateUserProfile, logout } = useAuthStore()

  const [name, setName] = useState(user?.name || '')
  const [level, setLevel] = useState(user?.level || 'A1')
  const [country, setCountry] = useState(user?.country || '')
  const [nativeLanguage, setNativeLanguage] = useState(user?.nativeLanguage || 'Português')
  const [bio, setBio] = useState(user?.bio || '')
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile')

  const handleSave = () => {
    updateUserProfile({ name, level, country, nativeLanguage, bio })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/auth'
  }

  if (!open) return null

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'preferences', label: 'Preferências', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Lock },
  ] as const

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-dark-800 shadow-2xl z-50 flex flex-col overflow-hidden animate-slideDown">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-900">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
            alt={user?.name}
            className="w-16 h-16 rounded-full ring-4 ring-white dark:ring-dark-700"
          />
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {user?.role === 'student' ? '📚 Aluno' : user?.role === 'teacher' ? '👨‍🏫 Professor' : '🔐 Admin'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-dark-700 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* ─── PERFIL ─── */}
          {activeTab === 'profile' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nome Completo
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nível de Inglês
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all ${
                        level === l
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  País
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ex: Brasil"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Língua Nativa
                </label>
                <select
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Sobre mim
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Conte um pouco sobre você..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </>
          )}

          {/* ─── PREFERÊNCIAS ─── */}
          {activeTab === 'preferences' && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon size={20} className="text-primary-500" /> : <Sun size={20} className="text-amber-500" />}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Modo Escuro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Alterna o tema da interface</p>
                  </div>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-secondary-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Notificações Push</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lembretes de estudo diário</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Emails de Progresso</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Resumo semanal por email</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* ─── SEGURANÇA ─── */}
          {activeTab === 'security' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <Button variant="primary" className="w-full" icon={<Lock size={16} />}>
                Alterar Senha
              </Button>

              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                  Zona de Perigo
                </p>
                <p className="text-xs text-red-600 dark:text-red-500 mb-3">
                  Esta ação é irreversível e apagará todos os seus dados.
                </p>
                <Button variant="danger" size="sm" icon={<Trash2 size={14} />}>
                  Excluir Conta
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700 flex gap-3">
          {activeTab !== 'security' && (
            <Button
              variant="primary"
              className="flex-1"
              icon={saved ? undefined : <Save size={16} />}
              onClick={handleSave}
            >
              {saved ? '✓ Salvo!' : 'Salvar'}
            </Button>
          )}
          <Button
            variant="danger"
            className={activeTab !== 'security' ? 'flex-none' : 'flex-1'}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </aside>
    </>
  )
}

export default SettingsPanel
