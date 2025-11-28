# 13-Role RBAC Betting System

A production-ready full-stack betting platform with comprehensive role-based access control.

## 📁 Project Structure

```
betting_all_in_one/
├── client/          # React Frontend (Vite)
├── server/          # NestJS Backend API
├── docs/            # Documentation
└── .github/         # GitHub workflows
```

## 🚀 Quick Start

### Local Development

**Backend:**
```bash
cd server
npm install
npm run start:dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

**Database:** PostgreSQL (Docker or local)

### Vercel Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment guide.

## 🔐 13-Role Hierarchy

```
OWNER → MOTHER → WHITELABEL → SUPERADMIN → ADMIN → 
B2C_SUBADMIN → B2B_SUBADMIN → SENIOR_AFFILIATE → AFFILIATE → 
SUPER_AGENT → MASTER_AGENT → AGENT → USER
```

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Role System Documentation](./docs/ROLES.md)
- [Quick Start Guide](./QUICK_START.md)
- [Verification Guide](./VERIFICATION.md)

## 🧪 Test Accounts

All accounts use password: `password123`

- `owner` - Highest privilege
- `admin` - Administrator
- `agent` - Agent level
- `testuser` - Regular user

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- React Router
- Axios
- i18next (EN/BN)

**Backend:**
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

## 📦 Features

- ✅ 13-role hierarchical RBAC
- ✅ Role-based dashboard routing
- ✅ User/Agent/Admin management
- ✅ Match market management
- ✅ General settings
- ✅ Multi-language support
- ✅ Responsive dark theme UI

## 🌐 Live Demo

- Frontend: [Deploy on Vercel]
- Backend: [Deploy on Vercel]

## 📄 License

See [LICENSE](./LICENSE) file.

## 🤝 Contributing

This is a production system. Contact repository owner for contributions.
