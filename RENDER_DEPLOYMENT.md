# Render Backend Deployment Guide

## 🚀 Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Connect your GitHub repository

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo: `Patient_Lab_Test_Portal`
3. Configure settings:
   - **Name**: `wellscan-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Environment Variables
Add these environment variables in Render dashboard:

```bash
MONGODB_URI=mongodb+srv://orimforai:HELLOYOU8008@cluster0.zmzuy.mongodb.net/wellscan
JWT_SECRET=patient-portal-super-secret-key-change-in-production-2024
NODE_ENV=production
PORT=5000
CLIENT_URL=https://well-scan-a8dg0fc5d-rohit-xo21s-projects.vercel.app
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://wellscan-backend.onrender.com`

### Step 5: Update Frontend
Update client/.env with your Render URL:
```bash
VITE_API_URL=https://wellscan-backend.onrender.com/api
```

## ✅ Integration Features

### Authentication
- ✅ Cross-domain cookie support
- ✅ Multiple token fallbacks (localStorage + cookies)
- ✅ Authorization header authentication
- ✅ Comprehensive CORS configuration

### API Features
- ✅ Patient registration/login
- ✅ JWT token management
- ✅ Test catalog management
- ✅ Smart booking system
- ✅ Booking history
- ✅ PDF report generation

### Security
- ✅ Secure HTTPS cookies
- ✅ SameSite=None for cross-domain
- ✅ CORS for all HTTPS origins
- ✅ Input validation and sanitization

## 🔗 Final URLs
- **Frontend**: https://well-scan-a8dg0fc5d-rohit-xo21s-projects.vercel.app
- **Backend**: https://wellscan-backend.onrender.com (after deployment)
- **API Base**: https://wellscan-backend.onrender.com/api

## 🧪 Testing Authentication
1. Visit frontend URL
2. Register new account
3. Login with credentials
4. Access protected features (booking, history)
5. Verify token persistence across page refreshes
