# 🚀 WasteNot Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** (you already have this)
2. **Railway Account** (free) - https://railway.app
3. **Vercel Account** (free) - https://vercel.com
4. **MongoDB Atlas Account** (free) - https://mongodb.com/atlas

## 🔧 Step 1: Backend Deployment (Railway)

### 1.1 Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add your IP to network access (or use 0.0.0.0/0 for all IPs)

### 1.2 Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your `wasteNot` repository
6. Select the `backend` folder

### 1.3 Configure Environment Variables
In Railway dashboard, add these environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=wasteNot_2024_$3cr3t_k3y_!@#$%^&*()_+-=[]{}|;:,.<>?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 1.4 Deploy
1. Railway will automatically detect it's a Node.js app
2. It will install dependencies and start the server
3. Get your backend URL (e.g., `https://wastenot-backend.railway.app`)

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `wasteNot` repository
5. Set the root directory to `frontend`

### 2.2 Configure Environment Variables
In Vercel dashboard, add these environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-railway-url.railway.app
NEXT_PUBLIC_APP_NAME=WasteNot
NEXT_PUBLIC_APP_DESCRIPTION=Food Waste Rescue Platform
```

### 2.3 Deploy
1. Vercel will automatically detect it's a Next.js app
2. It will build and deploy your frontend
3. Get your frontend URL (e.g., `https://wastenot.vercel.app`)

## 🔄 Step 3: Update Backend CORS

After getting your frontend URL, update the backend CORS in Railway:

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend

## 🧪 Step 4: Testing

### 4.1 Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.railway.app/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2024-12-24T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Test registration/login
3. Test all features
4. Check console for errors

## 🔒 Step 5: Security Checklist

- [ ] MongoDB Atlas network access configured
- [ ] Strong JWT secret set
- [ ] Environment variables secured
- [ ] CORS origins updated
- [ ] Rate limiting active
- [ ] SSL certificates working

## 📊 Step 6: Monitoring

### Railway Monitoring
- Check logs in Railway dashboard
- Monitor resource usage
- Set up alerts if needed

### Vercel Monitoring
- Check build logs
- Monitor performance
- Set up analytics

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Update `FRONTEND_URL` in backend
   - Check CORS configuration

2. **MongoDB Connection Issues**
   - Verify connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check dependency versions
   - Verify environment variables
   - Check build logs

4. **Runtime Errors**
   - Check application logs
   - Verify all environment variables are set
   - Test locally first

## 🔄 Continuous Deployment

Both Railway and Vercel will automatically redeploy when you push to GitHub:

1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Automatic deployment happens

## 📈 Scaling

### Railway Scaling
- Upgrade to paid plan for more resources
- Add multiple instances
- Set up auto-scaling

### Vercel Scaling
- Upgrade to Pro plan for more features
- Add custom domains
- Set up CDN

## 🎉 Success!

Your WasteNot app is now live and ready to help reduce food waste! 🍎♻️

### Your URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **API Health**: https://your-app.railway.app/api/health

### Next Steps:
1. Set up custom domain (optional)
2. Configure social login (optional)
3. Set up monitoring and analytics
4. Share your app with the world! 