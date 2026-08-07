#!/usr/bin/env bash
# Rebuild sudoku.js + sudoku.wasm from sudoku_wasm.cpp.
# Requires the Emscripten SDK on PATH (source ./emsdk_env.sh).
set -euo pipefail

# em++ (not emcc) so the C++ standard library is linked in.
em++ sudoku_wasm.cpp -o sudoku.js \
  -std=c++17 \
  -O3 \
  -lembind \
  -pthread \
  -sPTHREAD_POOL_SIZE=9 \
  -sMODULARIZE=1 \
  -sEXPORT_ES6=1 \
  -sEXPORT_NAME=SudokuModule \
  -sALLOW_MEMORY_GROWTH=1 \
  -sENVIRONMENT=web,worker,node

echo "Built sudoku.js / sudoku.wasm"
