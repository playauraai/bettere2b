#!/bin/bash

# Your E2B Clone SDK - Build Script
# This script builds both JavaScript and Python SDKs

set -e  # Exit on any error

echo "🎯 Building Your E2B Clone SDK"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "javascript" ] || [ ! -d "python" ]; then
    print_error "Please run this script from the server/sdk directory"
    exit 1
fi

# Build JavaScript SDK
print_status "Building JavaScript SDK..."
cd javascript

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if package-lock.json exists
if [ -f "package-lock.json" ]; then
    print_status "Installing JavaScript dependencies..."
    npm ci
fi

# Create dist directory
mkdir -p dist

# Build the package
print_status "Building JavaScript package..."
npm run build

# Test the build
print_status "Testing JavaScript SDK..."
if npm test; then
    print_success "JavaScript SDK tests passed!"
else
    print_warning "JavaScript SDK tests failed, but continuing..."
fi

# Check what will be published
print_status "Checking JavaScript package contents..."
npm pack --dry-run

cd ..

# Build Python SDK
print_status "Building Python SDK..."
cd python

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    print_error "Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

# Check Python version
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Python $REQUIRED_VERSION or higher is required. Found: $PYTHON_VERSION"
    exit 1
fi

# Install build dependencies
print_status "Installing Python build dependencies..."
$PYTHON_CMD -m pip install --upgrade pip
$PYTHON_CMD -m pip install build twine

# Clean previous builds
print_status "Cleaning previous Python builds..."
rm -rf dist/ build/ *.egg-info/

# Build the package
print_status "Building Python package..."
$PYTHON_CMD -m build

# Test the build
print_status "Testing Python SDK..."
if $PYTHON_CMD test.py; then
    print_success "Python SDK tests passed!"
else
    print_warning "Python SDK tests failed, but continuing..."
fi

# Check what will be published
print_status "Checking Python package contents..."
$PYTHON_CMD -m twine check dist/*

cd ..

# Summary
echo ""
echo "🎉 Build Complete!"
echo "=================="
print_success "JavaScript SDK built in: javascript/dist/"
print_success "Python SDK built in: python/dist/"
echo ""
echo "📦 Next Steps:"
echo "1. Test the packages locally"
echo "2. Update version numbers if needed"
echo "3. Publish to npm: cd javascript && npm publish --access public"
echo "4. Publish to PyPI: cd python && python -m twine upload dist/*"
echo ""
echo "📚 See PUBLISHING_GUIDE.md for detailed instructions"
