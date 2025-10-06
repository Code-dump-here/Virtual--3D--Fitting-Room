#!/bin/bash
# Virtual Fitting Room - Mac/Linux Setup Script

echo "=================================="
echo "Virtual Fitting Room Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js found: $NODE_VERSION"
else
    echo "✗ Node.js not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm found: v$NPM_VERSION"
else
    echo "✗ npm not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "✗ Installation failed"
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "✗ Build failed"
    exit 1
fi

echo "✓ Build successful"
echo ""

echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
echo "NOTE: The .env file contains Supabase credentials."
echo "The database is already configured and ready to use."
echo ""
