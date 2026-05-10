'use client'

import React from 'react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { Users, BarChart3, Settings, AlertCircle } from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuthStore()

  const stats = [
    { icon: Users, label: 'Total de Usuários', value: '1,234', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Users, label: 'Alunos Ativos', value: '892', color: 'text-green-600 dark:text-green-400' },
    { icon: Users, label: 'Professores', value: '45', color: 'text-purple-600 dark:text-purple-400' },
    { icon: BarChart3, label: 'Receita (Mês)', value: 'R$ 12.5k', color: 'text-amber-600 dark:text-amber-400' },
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
              Gerencie toda a plataforma EnglishCanvas
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
            {/* Gerenciamento */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Gerenciamento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Usuários', description: 'Gerenciar contas e permissões', icon: '👥' },
                  { title: 'Conteúdo', description: 'Aprovar e gerenciar cursos', icon: '📚' },
                  { title: 'Pagamentos', description: 'Relatórios e faturas', icon: '💳' },
                  { title: 'Relatórios', description: 'Análise e estatísticas', icon: '📊' },
                  { title: 'Suporte', description: 'Tickets e mensagens', icon: '🆘' },
                  { title: 'Configurações', description: 'Sistema e segurança', icon: '⚙️' },
                ].map((item) => (
                  <Card key={item.title} className="p-6 cursor-pointer hover:shadow-lg transition-all">
                    <p className="text-3xl mb-3">{item.icon}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {item.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Acessar
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Atividades */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Atividades Recentes
              </h2>

              {/* Alertas */}
              <Card className="p-6 mb-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                      ⚠️ 3 Alertas Pendentes
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                      Verifique problemas de segurança
                    </p>
                  </div>
                </div>
              </Card>

              {/* Log de Atividades */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Log do Sistema</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-blue-500 pl-3 py-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Novo usuário registrado
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 minutos atrás</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Backup completado
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 hora atrás</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3 py-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Novo pagamento processado
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 horas atrás</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-3 py-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Curso aprovado
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 dia atrás</p>
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

export default AdminDashboard
