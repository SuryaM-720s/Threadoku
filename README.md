# Threadoku

Threadoku is a high-performance Sudoku puzzle project that demonstrates concurrent programming by leveraging multi-threading (POSIX Threads or C++ Threads) for efficient solving. The project is split into a core C++ solver and a WebAssembly-integrated component, combining native performance with web accessibility.

Play Threadoku now: https://suryam-720s.github.io/Threadoku/

---

## Features

* **Multi-threaded Solving Algorithm:** The C++ solver splits the search tree at its root, giving each candidate for the first empty cell its own `std::thread`. The first branch to finish wins and the rest abort early.
* **WebAssembly Integration:** Compiles the C++ solver to WebAssembly, delivering native C++ performance directly in the browser via JavaScript accessibility.
* **Dynamic Puzzle Generation:** Integrates with an external Sudoku API to fetch puzzles dynamically.
* **Responsive Web Interface:** Provides a clean visualization of both the puzzle and the step-by-step solving process.
* **Cross-platform Compatibility:** The web application works on all modern browsers and devices.
* **Cross-Origin Isolation:** A service worker supplies the COOP/COEP headers that `SharedArrayBuffer` requires, so the threaded WASM build runs on GitHub Pages.

---

## Functionality 

To demonstrate the full life cycle of the application, from generation to solution, here are the key states:

### 1. Initial State -> Empty Board
This view shows the clean, responsive user interface before a puzzle is loaded.

<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/2c4b55b2-3719-4eac-84e2-cc48b0afdc4e" />

### 2. Randomly Generated Puzzle
This state confirms successful integration with the external Sudoku API, providing the input for the C++ solver.

<img width="400" height="400" alt="Screenshot 2025-10-28 at 7 24 06 PM" src="https://github.com/user-attachments/assets/fbbb3ff8-adb9-4d88-b139-0d1cf553cdf2" />

### 3. Solved State (Multi-threaded Output)
This final state validates the accuracy and speed of the multi-threaded C++ solving algorithm compiled via WebAssembly.

<img width="400" height="400" alt="Screenshot 2025-10-28 at 7 24 24 PM" src="https://github.com/user-attachments/assets/c45b62f6-139e-4be6-bfa4-f6bf9f12d768" />

---

## Installation and Setup

Since this project compiles C++ to WebAssembly, the prerequisites below are essential for compilation.

### Prerequisites

| Component | Minimum Version / Requirement | Notes |
| :--- | :--- | :--- |
| **Build System** | **CMake** (3.14 or higher) | Used to configure the WebAssembly build. |
| **WebAssembly** | **Emscripten SDK** | Required for C++ to `.wasm` compilation. Provides `em++` and `emcmake`. |
| **C++ Toolchain** | **C++17** support | Comes with Emscripten; the solver uses `<thread>`, `<mutex>`, and `<atomic>`. |
| **Web Server** | Any static file server | e.g. `python3 -m http.server`. Must be `http://`, not `file://`. |

### Dependencies (C++ Component)

* **None beyond the standard library.** The solver uses only `<vector>`, `<thread>`, `<mutex>`, and `<atomic>`, plus Emscripten's `embind` for the JavaScript boundary.
* Puzzles are fetched in the browser with `fetch()`, so no C++ HTTP or JSON library is needed.

---
## Code Structure

- sudoku_wasm.cpp: Core C++ solving algorithm with multi-threading
- sudoku-wasm-wrapper.js: JavaScript bridge for WebAssembly integration
- solver-worker.js: Runs the WASM module in a Web Worker, off the main thread
- coi-serviceworker.js: Adds COOP/COEP headers so SharedArrayBuffer is available
- index.html: Web interface with puzzle visualization
- sudoku.js: Generated JavaScript glue code from Emscripten compilation
- sudoku.wasm: Compiled WebAssembly binary containing the solver logic
- build.sh: One-line Emscripten build, as an alternative to CMake
- CMakeLists.txt: Build configuration for the WebAssembly component


---

## Build and Run Instructions

### 1. Compile the WebAssembly Module

This compiles the threaded C++ solver into `sudoku.js` and `sudoku.wasm`, written to the
project root where `index.html` expects them.

```bash
# Clone the repository
git clone https://github.com/SuryaM-720s/Threadoku.git
cd Threadoku

# Activate Emscripten: Ensure your Emscripten environment is initialized in your terminal.
source <path/to/emsdk>/emsdk_env.sh

# Create and enter the build directory
mkdir build && cd build

# Configure the project with CMake, using the Emscripten toolchain
emcmake cmake ..

# Build the module
make
```

`build.sh` in the project root runs the equivalent `em++` command directly, if you would
rather skip CMake.

### 2. Run the Web Application

Any static file server will do; the project has no runtime dependencies.

```bash
# Serve Files: run from the directory containing index.html
cd ..
python3 -m http.server 8765
```

Open **http://localhost:8765**, then click **Generate Board** followed by **Solve Board**.

---

## Acknowledgments
Sudoku API for puzzle generation

