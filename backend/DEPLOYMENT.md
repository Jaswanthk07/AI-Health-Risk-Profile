# Health Risk Profiler - Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### One-Command Setup
```powershell
# Clone and setup everything
git clone <your-repo-url>
cd health-risk-profiler
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### Manual Setup
```bash
# Install all dependencies
npm run install-all

# Start backend (Terminal 1)
npm run start-backend

# Start frontend (Terminal 2) 
npm run start-frontend

# Run demo
npm run demo
```

## 🌐 Cloud Deployment

### Backend Deployment (Heroku)

1. **Prepare for deployment:**
```bash
cd health-profile-backend
git init
git add .
git commit -m "Initial commit"
```

2. **Deploy to Heroku:**
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-health-profiler-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

3. **Verify deployment:**
```bash
heroku open
# Visit: https://your-app.herokuapp.com/health
# API Docs: https://your-app.herokuapp.com/api-docs
```

### Frontend Deployment (Netlify)

1. **Build for production:**
```bash
cd health-profile-frontend
npm run build
```

2. **Deploy to Netlify:**
- Drag `dist` folder to Netlify dashboard
- Or connect GitHub repository for auto-deployment

3. **Environment variables:**
```env
VITE_API_URL=https://your-backend.herokuapp.com
```

### Database Setup (MongoDB Atlas)

1. **Create cluster:**
   - Visit [MongoDB Atlas](https://cloud.mongodb.com)
   - Create free cluster
   - Create database user
   - Whitelist IP addresses

2. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/health_risk_profiler
   ```

3. **Update environment variables:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health_risk_profiler
   ```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/health_risk_profiler
CORS_ORIGIN=http://localhost:8080,https://your-frontend-domain.com
NODE_ENV=development
API_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🧪 Testing Deployment

### Local Testing
```bash
# Test all endpoints
npm run test-api

# Run demo
npm run demo

# Test with PowerShell
cd health-profile-backend
powershell -ExecutionPolicy Bypass -File test-endpoints-fixed.ps1
```

### Production Testing
```bash
# Update base URL in test scripts
# Test production endpoints
curl https://your-api.herokuapp.com/health
curl https://your-api.herokuapp.com/api-docs
```

## 📊 Monitoring & Maintenance

### Health Monitoring
- **Health Check**: `GET /health`
- **Uptime Monitoring**: Use services like UptimeRobot
- **Error Tracking**: Implement Sentry or similar

### Performance Optimization
- **CDN**: Use Cloudflare for static assets
- **Caching**: Implement Redis for frequent queries
- **Database Indexing**: Optimize MongoDB queries

### Security Checklist
- ✅ Environment variables secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation implemented
- ✅ HTTPS enabled in production

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Health Risk Profiler

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-health-profiler-api"
          heroku_email: "your-email@example.com"
          appdir: "health-profile-backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy to Netlify
        run: |
          cd health-profile-frontend
          npm install
          npm run build
          npx netlify-cli deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **MongoDB connection failed:**
```bash
# Check MongoDB status
mongod --version
# Start MongoDB service
net start MongoDB
```

3. **CORS errors:**
```javascript
// Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:8080,https://your-domain.com
```

4. **Build failures:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
npm run dev -- --debug
```

## 📈 Scaling Considerations

### Horizontal Scaling
- **Load Balancer**: Use Nginx or cloud load balancers
- **Multiple Instances**: Deploy multiple backend instances
- **Database Sharding**: Scale MongoDB horizontally

### Performance Optimization
- **Caching**: Implement Redis for parsed results
- **CDN**: Use CloudFront or similar for static assets
- **Database Optimization**: Add indexes, optimize queries

### Monitoring
- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry, Bugsnag
- **Performance Monitoring**: Google Analytics, Mixpanel

## 🔐 Security Best Practices

### Production Security
- Use HTTPS everywhere
- Implement proper authentication
- Regular security audits
- Keep dependencies updated
- Use secrets management (AWS Secrets Manager, etc.)

### API Security
- Rate limiting (implemented)
- Input validation (implemented)
- SQL injection prevention (implemented)
- CORS configuration (implemented)
- Security headers (Helmet.js implemented)

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor error logs
- Performance optimization
- Security patches
- Database maintenance

### Support Channels
- GitHub Issues for bug reports
- Documentation updates
- Community support
- Professional support options

---

**Status: Production Ready** 🚀

This deployment guide covers everything needed to deploy the Health Risk Profiler to production environments with proper monitoring, security, and scalability considerations.
