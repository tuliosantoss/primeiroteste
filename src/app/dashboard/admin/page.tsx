'use client'

import React, { useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { User, UserRole } from '@/types'
import {
  Users,
  GraduationCap,
  UserCog,
  ShieldCheck,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

interface UserFormState {
  email: string
  name: string
  password: string
  role: UserRole
  level: User['level']
}

const emptyForm: UserFormState = {
  email: '',
  name: '',
  password: '',
  role: 'student',
  level: 'A1',
}

const AdminDashboard = () => {
  const { user: currentUser, users, adminUpdateUser, adminDeleteUser, adminCreateUser } =
    useAuthStore()

  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<UserFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const userList = useMemo(() => Object.values(users), [users])

  const stats = useMemo(() => {
    const total = userList.length
    const students = userList.filter((u) => u.role === 'student').length
    const teachers = userList.filter((u) => u.role === 'teacher').length
    const admins = userList.filter((u) => u.role === 'admin').length
    return { total, students, teachers, admins }
  }, [userList])

  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      const matchesRole = filterRole === 'all' || u.role === filterRole
      const q = search.trim().toLowerCase()
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      return matchesRole && matchesQuery
    })
  }, [userList, filterRole, search])

  const openEdit = (u: User) => {
    setEditingEmail(u.email)
    setCreating(false)
    setFormError(null)
    setForm({
      email: u.email,
      name: u.name,
      password: u.password || '',
      role: u.role,
      level: u.level,
    })
  }

  const openCreate = () => {
    setCreating(true)
    setEditingEmail(null)
    setFormError(null)
    setForm(emptyForm)
  }

  const closeModal = () => {
    setEditingEmail(null)
    setCreating(false)
    setFormError(null)
  }

  const handleSubmit = () => {
    setFormError(null)
    try {
      if (creating) {
        if (!form.email || !form.name || !form.password) {
          setFormError('Preencha email, nome e senha')
          return
        }
        if (form.password.length < 6) {
          setFormError('Senha deve ter pelo menos 6 caracteres')
          return
        }
        adminCreateUser({
          email: form.email,
          name: form.name,
          password: form.password,
          role: form.role,
          level: form.level,
        })
      } else if (editingEmail) {
        const updates: Partial<User> = {
          name: form.name,
          role: form.role,
          level: form.level,
        }
        if (form.password && form.password.length >= 6) {
          updates.password = form.password
        }
        adminUpdateUser(editingEmail, updates)
      }
      closeModal()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  const handleDelete = (email: string) => {
    if (currentUser?.email === email) return
    if (!confirm(`Excluir o usuário ${email}? Esta ação não pode ser desfeita.`)) return
    adminDeleteUser(email)
  }

  const roleBadge = (role: UserRole) => {
    const map: Record<UserRole, { label: string; cls: string }> = {
      student: { label: '📚 Aluno', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
      teacher: { label: '👨‍🏫 Professor', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
      admin: { label: '🔐 Admin', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
    }
    const { label, cls } = map[role]
    return (
      <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${cls}`}>
        {label}
      </span>
    )
  }

  const statCards = [
    { icon: Users, label: 'Total de Usuários', value: stats.total, color: 'text-blue-600 dark:text-blue-400' },
    { icon: GraduationCap, label: 'Alunos', value: stats.students, color: 'text-green-600 dark:text-green-400' },
    { icon: UserCog, label: 'Professores', value: stats.teachers, color: 'text-purple-600 dark:text-purple-400' },
    { icon: ShieldCheck, label: 'Administradores', value: stats.admins, color: 'text-amber-600 dark:text-amber-400' },
  ]

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Painel Administrativo 🔐
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie todos os usuários da plataforma EnglishCanvas
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon size={32} className={stat.color} />
                </div>
              </Card>
            ))}
          </div>

          {/* Users Management */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gerenciamento de Usuários
              </h2>
              <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
                Novo Usuário
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos os perfis</option>
                <option value="student">Alunos</option>
                <option value="teacher">Professores</option>
                <option value="admin">Administradores</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 dark:border-dark-700">
                  <tr className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    <th className="py-3 px-2">Usuário</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Perfil</th>
                    <th className="py-3 px-2">Nível</th>
                    <th className="py-3 px-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.email}
                      className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                            alt={u.name}
                            className="w-9 h-9 rounded-full"
                          />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                        {u.email}
                      </td>
                      <td className="py-3 px-2">{roleBadge(u.role)}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300">
                          {u.level}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(u.email)}
                            disabled={currentUser?.email === u.email}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              currentUser?.email === u.email
                                ? 'Você não pode excluir a própria conta'
                                : 'Excluir'
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Modal: Create / Edit */}
        {(editingEmail || creating) && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeModal}
            />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-white dark:bg-dark-800 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {creating ? 'Criar Novo Usuário' : 'Editar Usuário'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!creating}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {creating ? 'Senha' : 'Nova senha (opcional)'}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={creating ? 'Mínimo 6 caracteres' : 'Deixe vazio para manter'}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Perfil
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Nível
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) => setForm({ ...form, level: e.target.value as User['level'] })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formError && (
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                    {formError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-700">
                <Button variant="ghost" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSubmit}>
                  {creating ? 'Criar' : 'Salvar'}
                </Button>
              </div>
            </div>
          </>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

export default AdminDashboard
