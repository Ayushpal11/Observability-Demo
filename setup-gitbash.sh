#!/bin/bash

echo "🚀 Setting up Observability Demo with OpenTelemetry and SigNoz"
echo "=============================================================="

# Check if Docker is running - improved for Windows/Git Bash
if ! docker version > /dev/null 2>&1; then
    echo "❌ Docker is not running or not accessible."
    echo ""
    echo "💡 Make sure Docker Desktop is running and you're logged in."
    echo "   If using Git Bash, try running this in Windows Command Prompt instead."
    exit 1
fi

echo "✅ Docker is running"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Node.js is installed"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Start SigNoz stack
echo "🐳 Starting SigNoz observability stack..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start SigNoz stack"
    echo ""
    echo "💡 Try running 'docker-compose up -d' manually to see detailed error messages."
    exit 1
fi

echo "✅ SigNoz stack started"
echo "⏳ Waiting for services to be ready..."

# Wait for services to be ready
sleep 30

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo "📊 SigNoz UI: http://localhost:3301 (admin/admin)"
echo "🔗 Prometheus: http://localhost:9090"
echo "📈 AlertManager: http://localhost:9093"
echo ""
echo "🚀 To start the demo application:"
echo "   npm start"
echo ""
echo "📊 To run load testing:"
echo "   npm run load-test"
echo ""
echo "🛑 To stop everything:"
echo "   docker-compose down" 