'use client'

import React from 'react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react'

const TeacherDashboard = () => {
  const { user } = useAuthStore()

  const stats = [
    { icon: Users, label: 'Alunos', value: '24', color: 'text-blue-600 dark:text-blue-400' },
    { icon: BookOpen, label: 'Cursos', value: '5', color: 'text-green-600 dark:text-green-400' },
    { icon: TrendingUp, label: 'Progresso Médio', value: '72%', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Award, label: 'Avaliação', value: '4.8★', color: 'text-amber-600 dark:text-amber-400' },
  ]

  return (
    <ProtectedRoute requiredRole="teacher">
      <Layout>
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo, Professor(a) {user?.name}! 👨‍🏫
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus cursos e acompanhe o progresso de seus alunos
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meus Cursos */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Meus Cursos</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          Curso {i}: English Level {String.fromCharCode(64 + i)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {8 - i} alunos inscritos • Criado há {i * 3} meses
                        </p>

                        <div className="flex gap-2">
                          <Button variant="primary" size="sm">
                            Ver Alunos
                          </Button>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Estatísticas
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{85 - i * 5}%</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Progresso Médio</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  ➕ Criar Novo Curso
                </Button>
                <Button variant="outline" className="w-full">
                  📊 Ver Estatísticas
                </Button>
                <Button variant="outline" className="w-full">
                  💬 Mensagens
                </Button>
                <Button variant="outline" className="w-full">
                  📅 Agendar Aula
                </Button>
              </div>

              {/* Próximas Aulas */}
              <Card className="mt-6 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Próximas Aulas</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-primary-500 pl-3 py-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      Turma A1
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hoje às 14:00</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-3 py-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      Turma B1
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Amanhã às 16:00</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

export default TeacherDashboard
