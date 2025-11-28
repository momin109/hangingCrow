# Full Betting Frontend UI

Production-ready React frontend for the betting platform with comprehensive role-based access control.

## Features

- ✅ **13-Role Support**: OWNER, MOTHER, WHITELABEL, SUPERADMIN, ADMIN, B2C_SUBADMIN, B2B_SUBADMIN, SENIOR_AFFILIATE, AFFILIATE, SUPER_AGENT, MASTER_AGENT, AGENT, USER
- ✅ **Role-Based Routing**: Automatic redirect based on user role after login
- ✅ **Protected Routes**: Access control based on user permissions
- ✅ **Multi-Language**: English and Bengali (বাংলা) support
- ✅ **Modern Dark Theme**: Premium UI with smooth animations
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Authentication**: JWT-based auth with localStorage persistence
- ✅ **Dashboards**: Separate dashboards for users, agents, and admins

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Top navigation with language switcher
│   ├── Sidebar.jsx     # Role-based sidebar navigation
│   └── ProtectedRoute.jsx  # Route guard component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication & user state
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── NotFound.jsx
│   ├── user/           # User pages
│   ├── agent/          # Agent pages
│   └── admin/          # Admin pages
├── i18n/               # Internationalization
│   ├── index.js
│   └── locales/
│       ├── en.json
│       └── bn.json
├── App.jsx             # Main app with routes
├── main.jsx            # Entry point
└── styles.css          # Global styles
```

## Default Test Accounts

All passwords are `password123`:

| Username | Role | Access Level |
|----------|------|-------------|
| owner | OWNER | Full platform access |
| mother | MOTHER | High-level management |
| whitelabel | WHITELABEL | White label management |
| superadmin | SUPERADMIN | Super admin access |
| admin | ADMIN | Admin access |
| b2c_subadmin | B2C_SUBADMIN | B2C operations |
| b2b_subadmin | B2B_SUBADMIN | B2B operations |
| senior_affiliate | SENIOR_AFFILIATE | Senior affiliate |
| affiliate | AFFILIATE | Affiliate |
| super_agent | SUPER_AGENT | Super agent |
| master_agent | MASTER_AGENT | Master agent |
| agent | AGENT | Agent |
| testuser | USER | Regular user |

## API Integration

The frontend expects the backend API at `/api`. Update `vite.config.js` to change the proxy:

```javascript
server: {
  proxy: {
    "/api": "http://localhost:3000"  // Change this to your backend URL
  }
}
```

## Environment Variables

Create a `.env` file if needed:

```
VITE_API_URL=http://localhost:3000
```

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **i18next** - Internationalization
- **React Icons** - Icon library

## Features by Role

### User Features
- Dashboard with balance overview
- Wallet (deposit/withdraw)
- My Bets
- Profile & KYC upload
- Referral system

### Agent Features
- Agent dashboard with stats
- Client management
- Balance give/take
- Downline tree visualization

### Admin Features
- Platform statistics
- User management
- Agent management
- Reports & CSV export

## Support

For issues or questions, contact the development team.
