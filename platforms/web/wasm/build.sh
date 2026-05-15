#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for Emscripten
if [ -z "$EMSDK" ]; then
    log_error "Emscripten SDK not found. Please activate emsdk first:"
    log_error "  source /path/to/emsdk/emsdk_env.sh"
    exit 1
fi

log_info "Emscripten SDK: $EMSDK"
log_info "Repository root: $REPO_ROOT"

# Clean previous build
if [ "$1" == "--clean" ]; then
    log_info "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
    shift
fi

# Create build directory
mkdir -p "$BUILD_DIR"

# Configure with Emscripten
log_info "Configuring with Emscripten..."
emcmake cmake \
    -S "$SCRIPT_DIR" \
    -B "$BUILD_DIR" \
    -DCMAKE_BUILD_TYPE=Release \
    -DAGENUI_REPO_ROOT="$REPO_ROOT"

# Build
log_info "Building WASM module..."
cmake --build "$BUILD_DIR" --parallel "$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"

# Verify outputs
if [ -f "$BUILD_DIR/agenui_parser.js" ] && [ -f "$BUILD_DIR/agenui_parser.wasm" ]; then
    log_info "Build successful!"
    log_info "  JS glue: $BUILD_DIR/agenui_parser.js"
    log_info "  WASM:    $BUILD_DIR/agenui_parser.wasm"
    
    # Show file sizes
    JS_SIZE=$(du -h "$BUILD_DIR/agenui_parser.js" | cut -f1)
    WASM_SIZE=$(du -h "$BUILD_DIR/agenui_parser.wasm" | cut -f1)
    log_info "  JS size:  $JS_SIZE"
    log_info "  WASM size: $WASM_SIZE"
else
    log_error "Build failed: outputs not found"
    exit 1
fi
