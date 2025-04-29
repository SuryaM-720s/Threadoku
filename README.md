# Threadoku
Overview
Threadoku is a high-performance Sudoku puzzle solver that leverages multi-threading and parallel processing techniques to solve puzzles efficiently. The project combines C++ concurrent programming with WebAssembly to deliver a responsive web application that can generate and solve Sudoku puzzles with impressive speed.

 **Features**

Multi-threaded solving algorithm: Utilizes parallel processing for up to 63% faster puzzle solving
WebAssembly integration: C++ performance with JavaScript accessibility
Dynamic puzzle generation: Integration with external Sudoku API
Responsive web interface: Clean visualization of both puzzle and solving process
Cross-platform compatibility: Works on all modern browsers and devices

**Installation**

Prerequisites: 
- CMake (3.14 or higher)
- C++ compiler with C++17 support
- Emscripten SDK (for WebAssembly compilation)
- Node.js and npm (for running the development server)
  
Dependencies:
- CPR library (for API requests)
- nlohmann/json (for JSON parsing)

**Code Structure:**
- sudoku_wasm.cpp: Core C++ solving algorithm with multi-threading
- sudoku-wasm-wrapper.js: JavaScript bridge for WebAssembly integration
- index.html: Web interface with puzzle visualization
- sudoku.js: Generated JavaScript glue code from Emscripten compilation
- sudoku.wasm: Compiled WebAssembly binary containing the solver logic
- CMakeLists.txt: Build configuration for the C++ component

Acknowledgments: Sudoku API for puzzle generation
