#!/bin/bash

# 🚀 Quick Start Setup Script
# Run this after cloning the repository

echo "🎨 JIRA MIS Dashboard - Quick Setup"
echo "===================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    echo "   Please upgrade: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup environment
echo "🔧 Setting up environment variables..."

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your JIRA credentials:"
    echo "   1. JIRA_BASE_URL=https://your-domain.atlassian.net"
    echo "   2. JIRA_EMAIL=your-email@company.com"
    echo "   3. JIRA_API_TOKEN=your-api-token"
    echo ""
    echo "   Get API token: https://id.atlassian.com/manage-profile/security/api-tokens"
    echo ""
else
    echo "⚠️  .env.local already exists - skipping"
fi

# Create public directory if it doesn't exist
mkdir -p public

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env.local with your JIRA credentials"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full project guide"
echo "   - DEPLOYMENT.md - Deploy to Vercel"
echo "   - PROJECT_STRUCTURE.md - Code organization"
echo ""
echo "🚀 Happy coding!"
