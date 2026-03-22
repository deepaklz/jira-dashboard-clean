#!/bin/bash

# 🚀 Automated Vercel Deployment Script
# This script will deploy your JIRA Dashboard to Vercel

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     JIRA Dashboard Pro - Vercel Deployment Wizard           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1/6:${NC} Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "  Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required (found v$NODE_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Step 2: Install Vercel CLI
echo ""
echo -e "${BLUE}Step 2/6:${NC} Installing Vercel CLI..."

if ! command -v vercel &> /dev/null; then
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✓ Vercel CLI already installed${NC}"
fi

# Step 3: Check environment variables
echo ""
echo -e "${BLUE}Step 3/6:${NC} Checking environment variables..."

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠ .env.local not found${NC}"
    echo ""
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  ACTION REQUIRED: Configure your JIRA credentials  ${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Please edit .env.local with your JIRA details:"
    echo ""
    echo "1. JIRA_BASE_URL=https://your-domain.atlassian.net"
    echo "2. JIRA_EMAIL=your-email@company.com"
    echo "3. JIRA_API_TOKEN=your-api-token"
    echo ""
    echo "Get API token: https://id.atlassian.com/manage-profile/security/api-tokens"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
fi

# Verify required variables are set
if ! grep -q "atlassian.net" .env.local 2>/dev/null; then
    echo -e "${RED}✗ JIRA_BASE_URL not configured in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables configured${NC}"

# Step 4: Install dependencies
echo ""
echo -e "${BLUE}Step 4/6:${NC} Installing dependencies..."

if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Step 5: Build test
echo ""
echo -e "${BLUE}Step 5/6:${NC} Testing build..."

npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    echo "  Run 'npm run build' to see errors"
    exit 1
fi

# Step 6: Deploy to Vercel
echo ""
echo -e "${BLUE}Step 6/6:${NC} Deploying to Vercel..."
echo ""

# Login to Vercel
echo "Logging into Vercel..."
vercel login

echo ""
echo "Starting deployment..."
echo ""

# Deploy (first time will ask questions)
vercel --prod

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              🎉 DEPLOYMENT SUCCESSFUL! 🎉                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠ IMPORTANT: Configure environment variables in Vercel${NC}"
echo ""
echo "1. Go to your Vercel project dashboard"
echo "2. Navigate to Settings → Environment Variables"
echo "3. Add these variables:"
echo "   - JIRA_BASE_URL"
echo "   - JIRA_EMAIL"
echo "   - JIRA_API_TOKEN"
echo ""
echo "4. Redeploy: vercel --prod"
echo ""
echo -e "${GREEN}Your dashboard is live! 🚀${NC}"
echo ""
