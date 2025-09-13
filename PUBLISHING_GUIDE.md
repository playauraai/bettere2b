# 🚀 Publishing Your E2B Clone SDK

Complete guide to compile, package, and publish your E2B SDK to GitHub and npm/PyPI.

## 📦 Quick Start

### 1. Build the SDK
```bash
# JavaScript SDK
cd server/sdk/javascript
npm run build

# Python SDK
cd server/sdk/python
python -m build
```

### 2. Test Locally
```bash
# JavaScript
npm test

# Python
python test.py
```

### 3. Publish to npm
```bash
cd server/sdk/javascript
npm publish --access public
```

### 4. Publish to PyPI
```bash
cd server/sdk/python
python -m twine upload dist/*
```

## 🔧 Detailed Setup

### Prerequisites

1. **Node.js & npm** (for JavaScript SDK)
2. **Python 3.8+** (for Python SDK)
3. **Git** (for version control)
4. **GitHub account** (for repository)
5. **npm account** (for publishing)
6. **PyPI account** (for Python publishing)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `your-e2b-clone-sdk`
3. Make it public
4. Initialize with README

```bash
# Clone your repository
git clone https://github.com/yourusername/your-e2b-clone-sdk.git
cd your-e2b-clone-sdk

# Copy your SDK files
cp -r /path/to/your/server/sdk/* .
```

### Step 2: Setup JavaScript SDK

```bash
cd javascript

# Install dependencies
npm install

# Build the package
npm run build

# Test locally
npm test

# Check what will be published
npm pack --dry-run
```

### Step 3: Setup Python SDK

```bash
cd python

# Install build tools
pip install build twine

# Build the package
python -m build

# Test locally
python test.py

# Check what will be published
twine check dist/*
```

### Step 4: Configure npm Publishing

1. **Login to npm:**
```bash
npm login
```

2. **Update package.json** (already done):
```json
{
  "name": "@your-e2b-clone/sdk",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  }
}
```

3. **Test publish:**
```bash
npm publish --dry-run
```

### Step 5: Configure PyPI Publishing

1. **Create PyPI account** at [pypi.org](https://pypi.org)

2. **Create API token:**
   - Go to Account Settings → API tokens
   - Create new token with scope: "Entire account"

3. **Configure credentials:**
```bash
# Create .pypirc file
cat > ~/.pypirc << EOF
[distutils]
index-servers = pypi

[pypi]
username = __token__
password = pypi-your-api-token-here
EOF
```

### Step 6: GitHub Actions Setup

1. **Add secrets to GitHub repository:**
   - Go to Settings → Secrets and variables → Actions
   - Add `NPM_TOKEN`: Your npm access token
   - Add `PYPI_TOKEN`: Your PyPI API token

2. **The CI/CD workflow is already configured** in `.github/workflows/ci.yml`

### Step 7: Publishing Process

#### Manual Publishing

**JavaScript SDK:**
```bash
cd server/sdk/javascript

# Update version
npm version patch  # or minor, major

# Build and publish
npm run build
npm publish --access public
```

**Python SDK:**
```bash
cd server/sdk/python

# Update version in setup.py
# Build and publish
python -m build
python -m twine upload dist/*
```

#### Automated Publishing (Recommended)

1. **Create a release on GitHub:**
   - Go to Releases → Create a new release
   - Tag version: `v1.0.0`
   - Title: `v1.0.0`
   - Description: Release notes

2. **GitHub Actions will automatically:**
   - Run tests
   - Build packages
   - Publish to npm and PyPI

## 📋 Publishing Checklist

### Before Publishing

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Run all tests
- [ ] Build packages locally
- [ ] Test packages locally
- [ ] Update documentation

### JavaScript SDK

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `npm pack --dry-run` shows correct files
- [ ] Package.json has correct metadata
- [ ] TypeScript definitions are included

### Python SDK

- [ ] `python -m build` succeeds
- [ ] `python test.py` passes
- [ ] `twine check dist/*` passes
- [ ] setup.py has correct metadata
- [ ] All dependencies are specified

### GitHub Repository

- [ ] README.md is complete
- [ ] LICENSE file is present
- [ ] .gitignore is configured
- [ ] GitHub Actions workflow is working
- [ ] Secrets are configured

## 🎯 Version Management

### Semantic Versioning

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Update Versions

**JavaScript:**
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

**Python:**
```bash
# Update version in setup.py and pyproject.toml
# Then create git tag
git tag v1.0.1
git push origin v1.0.1
```

## 🔍 Testing Published Packages

### Test JavaScript SDK

```bash
# Create test project
mkdir test-js-sdk
cd test-js-sdk
npm init -y

# Install your published package
npm install @your-e2b-clone/sdk

# Test it
node -e "
const { Sandbox } = require('@your-e2b-clone/sdk');
console.log('SDK loaded successfully!');
"
```

### Test Python SDK

```bash
# Create virtual environment
python -m venv test-python-sdk
source test-python-sdk/bin/activate  # On Windows: test-python-sdk\Scripts\activate

# Install your published package
pip install your-e2b-clone

# Test it
python -c "
from your_e2b_clone import Sandbox
print('SDK loaded successfully!')
"
```

## 🚨 Troubleshooting

### Common Issues

1. **npm publish fails:**
   - Check if package name is available
   - Ensure you're logged in: `npm whoami`
   - Check package.json metadata

2. **PyPI upload fails:**
   - Verify API token is correct
   - Check .pypirc configuration
   - Ensure package name is unique

3. **GitHub Actions fails:**
   - Check secrets are configured
   - Verify workflow syntax
   - Check Node.js/Python versions

4. **Build fails:**
   - Check all dependencies are installed
   - Verify file paths are correct
   - Check for syntax errors

### Getting Help

- Check GitHub Issues
- Review npm/PyPI documentation
- Test locally first
- Use dry-run options

## 🎉 Success!

Once published, users can install your SDK:

**JavaScript:**
```bash
npm install @your-e2b-clone/sdk
```

**Python:**
```bash
pip install your-e2b-clone
```

Your E2B Clone SDK is now available to the world! 🌍
