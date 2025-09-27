# Health Risk Profiler - Complete Setup Script
# This script sets up the entire project and runs the demo

Write-Host "🚀 Health Risk Profiler - Complete Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check Node.js installation
Write-Host "`n📋 Checking Prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "health-profile-backend"
npm install
Set-Location ".."

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "health-profile-frontend"
npm install
Set-Location ".."

Write-Host "`n✅ Installation complete!" -ForegroundColor Green

# Start MongoDB check
Write-Host "`n🗄️ Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MongoDB not detected. Please start MongoDB or use Atlas URI in .env" -ForegroundColor Orange
    }
} catch {
    Write-Host "⚠️ MongoDB status unknown. Ensure it's running or use Atlas URI" -ForegroundColor Orange
}

# Start backend
Write-Host "`n🔧 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\health-profile-backend'; npm run dev"
Start-Sleep -Seconds 3

# Test backend
Write-Host "`n🧪 Testing backend endpoints..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is running: $($healthCheck.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend not responding yet. Please wait a moment..." -ForegroundColor Orange
}

# Start frontend
Write-Host "`n🎨 Starting frontend application..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\health-profile-frontend'; npm run dev"

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:3000/api-docs" -ForegroundColor Cyan
Write-Host "🧪 Run Demo: npm run demo" -ForegroundColor Cyan
Write-Host "🧪 Test API: npm run test-api" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit http://localhost:8080 to use the application" -ForegroundColor White
Write-Host "2. Upload an image or enter health data" -ForegroundColor White
Write-Host "3. View the risk assessment results" -ForegroundColor White
Write-Host "4. Check http://localhost:3000/api-docs for API documentation" -ForegroundColor White

# Run demo
Write-Host "`n🎬 Running API Demo..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
node demo-script.js
