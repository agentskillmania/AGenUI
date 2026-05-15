#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
WEB_DIR="${REPO_ROOT}/platforms/web"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

log_info "Building AGenUI Web Platform..."
log_info "Repository root: $REPO_ROOT"

# Check Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js not found. Please install Node.js 18+."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js 18+ required. Found: $(node -v)"
    exit 1
fi

# Install dependencies
log_info "Installing dependencies..."
cd "$WEB_DIR"
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build WASM
log_info "Building WASM parser..."
bash wasm/build.sh

# Build SDK
log_info "Building Web SDK..."
npm run build

# Verify outputs
if [ -d "dist" ]; then
    log_info "Build successful!"
    log_info "Outputs in: $WEB_DIR/dist"
    ls -lh "$WEB_DIR/dist"
else
    log_error "Build failed: dist/ not found"
    exit 1
fi
