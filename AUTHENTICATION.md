# Sistema de Autenticação e Perfis de Usuário

## Visão Geral

A plataforma EnglishCanvas implementa um sistema robusto de autenticação com suporte a três tipos de perfil de usuário, cada um com funcionalidades e permissões específicas.

## Tipos de Usuário

### 1. **Student (Aluno)** 📚
Usuários com objetivo de aprender inglês.

**Funcionalidades:**
- Acesso a todos os módulos de aprendizado (Speaking, Writing, Reading, Listening, Vocabulary)
- Rastreamento de progresso pessoal
- Sistema de gamificação (XP, streaks, achievements)
- Flashcards e revisão espaçada
- Dashboard personalizado com metas semanais
- Interação com AI Tutor

**Dados do Perfil:**
```typescript
interface StudentProfile extends User {
  totalMinutesStudied: number
  currentStreak: number
  xp: number
}
```

---

### 2. **Teacher (Professor)** 👨‍🏫
Usuários que criam conteúdo e ensinam.

**Funcionalidades:**
- Criar e gerenciar cursos
- Acompanhar progresso de alunos
- Criar exercícios e lições
- Receber avaliações de alunos
- Dashboard com estatísticas de ensino
- Gerenciar salas de aula

**Dados do Perfil:**
```typescript
interface TeacherProfile extends User {
  studentsCount: number
  coursesCreated: number
  totalStudentsLearned: number
}
```

---

### 3. **Admin (Administrador)** 🔐
Gerenciadores da plataforma.

**Funcionalidades:**
- Gerenciar todos os usuários (criar, editar, deletar)
- Aprovar/rejeitar conteúdo
- Visualizar analytics global
- Gerenciar pagamentos e inscrições
- Configurar sistema
- Acessar logs de auditoria
- Gerenciar suporte técnico

**Dados do Perfil:**
```typescript
interface AdminProfile extends User {
  permissions: string[]
}
```

---

## Fluxo de Autenticação

### 1. Registro de Usuário

```
┌─────────────────────────────────────────────┐
│ Página de Registro (/auth)                  │
├─────────────────────────────────────────────┤
│ 1. Usuário preenche formulário              │
│ 2. Seleciona tipo de perfil                 │
│ 3. Submete dados                            │
└─────────────────────────────────────────────┘
                    ↓
        Validação no Frontend
     - Email válido
     - Senha (min 6 chars)
     - Confirmação de senha
                    ↓
        Envio para Backend/Store
                    ↓
        Criação de Usuário
        (Mock localStorage)
                    ↓
        ✅ Login automático
        ↓
    Redireciona para Dashboard
```

### 2. Login

```
┌─────────────────────────────────────────────┐
│ Página de Login (/auth)                     │
├─────────────────────────────────────────────┤
│ 1. Email: student@test.com                  │
│ 2. Senha: password123                       │
│ 3. Submete                                  │
└─────────────────────────────────────────────┘
                    ↓
        Validação de Credenciais
                    ↓
        ✅ Sucesso: Armazena token
        ❌ Falha: Exibe erro
```

---

## Armazenamento de Dados

### localStorage (Demo)

A aplicação usa localStorage com Zustand persist middleware para demo:

```json
{
  "auth-storage": {
    "user": {
      "id": "1",
      "email": "student@test.com",
      "name": "João Silva",
      "role": "student",
      "level": "B1",
      "joinedAt": "2024-01-15T00:00:00.000Z",
      "darkMode": false,
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=..."
    },
    "isLoggedIn": true
  }
}
```

### Backend (Produção)

Para produção, implementar:

```typescript
// Backend API
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me (perfil atual)
PUT  /api/auth/profile (atualizar perfil)
```

---

## Proteção de Rotas

### ProtectedRoute Component

```typescript
<ProtectedRoute requiredRole="student">
  <DashboardContent />
</ProtectedRoute>
```

**Comportamentos:**
- Sem autenticação → Redireciona para `/auth`
- Autenticado, role correto → Renderiza conteúdo
- Autenticado, role inválido → Redireciona para dashboard geral

---

## Dashboards por Perfil

### Student Dashboard (`/dashboard/student`)
- Módulos de aprendizado
- Progresso e estatísticas
- Desafios diários
- Conquistas e badges

### Teacher Dashboard (`/dashboard/teacher`)
- Gerenciamento de cursos
- Acompanhamento de alunos
- Estatísticas de ensino
- Agendamento de aulas

### Admin Dashboard (`/dashboard/admin`)
- Gerenciamento de usuários
- Análise de plataforma
- Gerenciamento de conteúdo
- Relatórios e logs

---

## Contas de Demo

Para testar a aplicação:

### Aluno
```
Email: student@test.com
Senha: password123
Role:  student
```

### Professor
```
Email: teacher@test.com
Senha: password123
Role:  teacher
```

### Admin
```
Email: admin@test.com
Senha: password123
Role:  admin
```

---

## Store de Autenticação (Zustand)

### `useAuthStore`

```typescript
interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser(user: User): void
  logout(): void
  registerUser(email, password, name, role): Promise<void>
  loginUser(email, password): Promise<void>
}
```

### Uso no Componente

```typescript
const { user, isLoggedIn, loginUser, logout } = useAuthStore()

// Login
await loginUser('user@email.com', 'password')

// Logout
logout()

// Verificar estado
if (isLoggedIn) {
  console.log('Usuário:', user?.name)
}
```

---

## Segurança

### Implementado
- ✅ Validação de entrada no frontend
- ✅ Verificação de senha mínima (6 caracteres)
- ✅ Confirmação de senha no registro
- ✅ Proteção de rotas
- ✅ localStorage com expiração (configurável)

### Recomendado para Produção
- ⚠️ Hash de senha (bcrypt)
- ⚠️ JWT tokens com expiration
- ⚠️ HTTPS obrigatório
- ⚠️ Rate limiting no login
- ⚠️ 2FA (Two-Factor Authentication)
- ⚠️ CSRF protection
- ⚠️ Content Security Policy (CSP)
- ⚠️ Auditoria de ações administrativas

---

## Integração com Backend

### Passo 1: Substituir Mock Database

```typescript
// store/useAuthStore.ts
export const useAuthStore = create<AuthState>()((set) => ({
  // ... estado ...
  
  loginUser: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      set({ user: data.user, isLoggedIn: true })
      localStorage.setItem('auth-token', data.token)
    } catch (err) {
      set({ error: err.message })
    }
  }
}))
```

### Passo 2: Criar Endpoints API

```typescript
// pages/api/auth/login.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { email, password } = req.body
  
  try {
    // Hash password: const match = await bcrypt.compare(password, user.passwordHash)
    const user = await db.users.findUnique({ where: { email } })
    
    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
```

---

## Fluxo Completo (Exemplo)

```
Usuário visita /
        ↓
Redirecionado para /auth (não autenticado)
        ↓
Clica em "Cadastro"
        ↓
Preench formulário:
  - Nome: João Silva
  - Email: joao@example.com
  - Senha: senha123
  - Tipo: Student
        ↓
Clica "Cadastrar"
        ↓
registerUser() validação
        ↓
Criação em mock DB (ou backend)
        ↓
setUser() + isLoggedIn = true
        ↓
Redireciona para /dashboard
        ↓
DashboardRedirect verifica role
        ↓
Redireciona para /dashboard/student
        ↓
ProtectedRoute valida autenticação
        ↓
✅ StudentDashboard renderizado
```

---

## Troubleshooting

### "Erro ao fazer login"
- Verifique email e senha
- Certifique-se de usar uma conta de demo válida
- Limpe o localStorage se tiver problemas

### Página fica branca após login
- Verifique o console do navegador para erros
- Confirme que o usuário tem um role válido
- Limpe cache e tente novamente

### Sai da sessão ao recarregar
- localStorage pode estar desabilitado
- Verifique modo anônimo do navegador
- Verifique quotas de armazenamento

---

## Próximos Passos

1. **Backend Real**: Implementar APIs com autenticação JWT
2. **Banco de Dados**: PostgreSQL com ORM (Prisma)
3. **Hash de Senha**: bcrypt ou argon2
4. **Social Login**: Google, GitHub OAuth
5. **2FA**: TOTP (Google Authenticator)
6. **Rate Limiting**: Proteção contra brute force
7. **Refresh Tokens**: Segurança aprimorada
