@echo off
echo 🚀 Setting up Observability Demo with OpenTelemetry and SigNoz
echo ==============================================================

REM Check if Docker is running - improved detection
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running or not accessible. Please start Docker Desktop and try again.
    echo.
    echo 💡 Make sure Docker Desktop is running and you're logged in.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Start SigNoz stack
echo 🐳 Starting SigNoz observability stack...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start SigNoz stack
    echo.
    echo 💡 Try running 'docker-compose up -d' manually to see detailed error messages.
    pause
    exit /b 1
)

echo ✅ SigNoz stack started
echo ⏳ Waiting for services to be ready...

REM Wait for services to be ready
timeout /t 30 /nobreak >nul

echo.
echo 🎉 Setup complete!
echo ==================
echo 📊 SigNoz UI: http://localhost:3301 (admin/admin)
echo 🔗 Prometheus: http://localhost:9090
echo 📈 AlertManager: http://localhost:9093
echo.
echo 🚀 To start the demo application:
echo    npm start
echo.
echo 📊 To run load testing:
echo    npm run load-test
echo.
echo 🛑 To stop everything:
echo    docker-compose down
echo.
pause 