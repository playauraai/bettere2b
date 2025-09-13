@echo off
REM Your E2B Clone SDK - Build Script for Windows
REM This script builds both JavaScript and Python SDKs

echo 🎯 Building Your E2B Clone SDK
echo ================================

REM Check if we're in the right directory
if not exist "javascript" (
    echo [ERROR] Please run this script from the server/sdk directory
    exit /b 1
)
if not exist "python" (
    echo [ERROR] Please run this script from the server/sdk directory
    exit /b 1
)

REM Build JavaScript SDK
echo [INFO] Building JavaScript SDK...
cd javascript

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

REM Install dependencies if package-lock.json exists
if exist "package-lock.json" (
    echo [INFO] Installing JavaScript dependencies...
    npm ci
)

REM Create dist directory
if not exist "dist" mkdir dist

REM Build the package
echo [INFO] Building JavaScript package...
npm run build

REM Test the build
echo [INFO] Testing JavaScript SDK...
npm test
if errorlevel 1 (
    echo [WARNING] JavaScript SDK tests failed, but continuing...
) else (
    echo [SUCCESS] JavaScript SDK tests passed!
)

REM Check what will be published
echo [INFO] Checking JavaScript package contents...
npm pack --dry-run

cd ..

REM Build Python SDK
echo [INFO] Building Python SDK...
cd python

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.8+ first.
    exit /b 1
)

REM Install build dependencies
echo [INFO] Installing Python build dependencies...
python -m pip install --upgrade pip
python -m pip install build twine

REM Clean previous builds
echo [INFO] Cleaning previous Python builds...
if exist "dist" rmdir /s /q dist
if exist "build" rmdir /s /q build
if exist "*.egg-info" rmdir /s /q *.egg-info

REM Build the package
echo [INFO] Building Python package...
python -m build

REM Test the build
echo [INFO] Testing Python SDK...
python test.py
if errorlevel 1 (
    echo [WARNING] Python SDK tests failed, but continuing...
) else (
    echo [SUCCESS] Python SDK tests passed!
)

REM Check what will be published
echo [INFO] Checking Python package contents...
python -m twine check dist/*

cd ..

REM Summary
echo.
echo 🎉 Build Complete!
echo ==================
echo [SUCCESS] JavaScript SDK built in: javascript/dist/
echo [SUCCESS] Python SDK built in: python/dist/
echo.
echo 📦 Next Steps:
echo 1. Test the packages locally
echo 2. Update version numbers if needed
echo 3. Publish to npm: cd javascript ^&^& npm publish --access public
echo 4. Publish to PyPI: cd python ^&^& python -m twine upload dist/*
echo.
echo 📚 See PUBLISHING_GUIDE.md for detailed instructions

pause
