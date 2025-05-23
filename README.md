# 🚀 Sistema de Indicações - Deploy na Vercel

Este projeto é um sistema completo de indicações com:

- Next.js 15 (App Router)
- Tailwind CSS v4
- Prisma + PostgreSQL
- Autenticação JWT com cookies

---

## ✅ Tecnologias Utilizadas

- **Next.js 15**
- **Prisma ORM**
- **PostgreSQL**
- **Tailwind CSS v4**
- **Docker (para desenvolvimento local)**

---

## 📦 Estrutura do Projeto

```
src/
 ├─ app/               # Rotas com App Router
 ├─ components/        # Componentes reutilizáveis
 ├─ hooks/             # Hooks customizados
 ├─ lib/prisma.ts      # Instância Prisma
 ├─ utils/             # Helpers (ex: formatadores)
 └─ prisma/schema.prisma  # Schema do banco
```

---

## 🔧 Configuração Local

1. Clone o projeto:

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

2. Crie o `.env.local` com:

```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/database
JWT_SECRET=sua-chave-secreta
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Instale as dependências:

```bash
npm install
```

4. Rode as migrations:

```bash
npx prisma migrate dev
```

5. Suba localmente:

```bash
npm run dev
```

---

## ☁️ Deploy na Vercel

### 1. Suba o projeto no GitHub

```bash
git init
git remote add origin https://github.com/seu-usuario/seu-repo.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Acesse [https://vercel.com](https://vercel.com)

- Crie uma conta e conecte seu GitHub
- Clique em **"New Project"** e importe o repositório
- Selecione **Next.js** como framework

### 3. Adicione variáveis de ambiente na Vercel

| Nome                   | Valor                                      |
| ---------------------- | ------------------------------------------ |
| `DATABASE_URL`         | `postgres://usuario:senha@host:5432/banco` |
| `JWT_SECRET`           | sua chave segura                           |
| `NEXT_PUBLIC_BASE_URL` | `https://nome-da-sua-app.vercel.app`       |

### 4. Finalize o deploy

Clique em **Deploy** e aguarde a build.

---

## 🛠 Migrar Banco em Produção

A Vercel **não roda migrate automaticamente**, então rode manualmente:

```bash
npx prisma migrate deploy
```

Ou, em produção com variável:

```bash
DATABASE_URL=postgres://... npx prisma migrate deploy
```

---

## 📬 Contato

Em caso de dúvidas, sugestões ou contribuições, abra uma issue ou entre em contato com o autor.

---

Deploy final em: [https://sua-app.vercel.app](https://sua-app.vercel.app)

---

**Feito com ❤️ usando Next.js + Prisma + Tailwind.**
