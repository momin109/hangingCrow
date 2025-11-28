# Vercel Deployment Guide

## Project Structure

```
betting_all_in_one/
├── client/          # React Frontend (Vite)
├── server/          # NestJS Backend  
├── vercel.json      # Root Vercel config
└── README.md
```

## Prerequisites

1. **GitHub Account** - Repository already at: https://github.com/affan22ariyan/dead-root
2. **Vercel Account** - Sign up at vercel.com with your GitHub account
3. **Database** - Set up free Neon Postgres (instructions below)

## Step 1: Set Up Neon Database (Free)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project: "betting-db"
4. Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech/betting_db`)

### Run Migrations on Neon

```bash
cd server
# Update .env with Neon connection string
DATABASE_URL="your-neon-connection-string"

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `affan22ariyan/dead-root`
4. Vercel will auto-detect the setup

**Backend Deployment**:
- Root Directory: `server`
- Build Command: (leave default)
- Output Directory: (leave default)
- Install Command: `npm install`

**Frontend Deployment**:
- Root Directory: `client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy backend
cd server
vercel --prod

# Deploy frontend
cd ../client
vercel --prod
```

## Step 3: Configure Environment Variables

### In Vercel Dashboard (for Backend)

Go to your backend project → Settings → Environment Variables

Add these:
```
DATABASE_URL = your-neon-connection-string
JWT_SECRET = your-production-secret-key-min-32-chars
NODE_ENV = production
```

### In Vercel Dashboard (for Frontend)

Go to your frontend project → Settings → Environment Variables

Add:
```
VITE_API_URL = https://your-backend.vercel.app/api
```

## Step 4: Connect Frontend to Backend

After both are deployed:

1. Get your backend URL (e.g., `https://server-abc123.vercel.app`)
2. Update frontend environment variable:
   - `VITE_API_URL` = `https://server-abc123.vercel.app/api`
3. Redeploy frontend

## Step 5: Test Deployment

1. Open your frontend URL (e.g., `https://client-xyz789.vercel.app`)
2. Try logging in with:
   - Username: `admin`
   - Password: `password123`
3. Should redirect to admin dashboard

## Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to database"
- **Solution**: Check DATABASE_URL in Vercel environment variables
- Ensure Neon database is active

**Problem**: "Module not found"
- **Solution**: Add missing dependencies to `server/package.json`
- Redeploy

### Frontend Issues

**Problem**: "API calls fail with CORS"
- **Solution**: Ensure backend has `app.enableCors()` in main.ts
- Check VITE_API_URL points to correct backend

**Problem**: "Build fails"
- **Solution**: Run `npm run build` locally first to test
- Check build logs in Vercel dashboard

## Custom Domain (Optional)

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be auto-generated

## Monitoring

- View logs: Vercel Dashboard → Your Project → Logs
- Monitor errors: Vercel Dashboard → Your Project → Analytics

## Update Deployment

Any push to `main` branch on GitHub will auto-deploy to Vercel.

```bash
git add .
git commit -m "Update"
git push origin main
```

## Cost

- **Vercel**: Free for hobby projects
- **Neon Postgres**: Free tier (3GB storage, shared compute)
- **Total**: $0/month

## Support

If deployment fails, check:
1. Vercel build logs
2. Environment variables are set correctly
3. Database connection is working
4. All dependencies are in package.json
