# Threadoku

Threadoku is a high-performance Sudoku puzzle project that demonstrates concurrent programming by leveraging multi-threading (POSIX Threads or C++ Threads) for efficient solving. The project is split into a core C++ solver and a WebAssembly-integrated component, combining native performance with web accessibility.

---

## Features

* **Multi-threaded Solving Algorithm:** The core C++ solver utilizes concurrent programming to speed up the puzzle-solving process significantly.
* **WebAssembly Integration:** Compiles the C++ solver to WebAssembly, delivering native C++ performance directly in the browser via JavaScript accessibility.
* **Dynamic Puzzle Generation:** Integrates with an external Sudoku API to fetch puzzles dynamically.
* **Responsive Web Interface:** Provides a clean visualization of both the puzzle and the step-by-step solving process.
* **Cross-platform Compatibility:** The web application works on all modern browsers and devices.

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

Since this project involves both a standard C++ executable and a WebAssembly component, the prerequisites are extensive and essential for compilation.

### Prerequisites

| Component | Minimum Version / Requirement | Notes |
| :--- | :--- | :--- |
| **Build System** | **CMake** (3.14 or higher) | Used to configure the C++ build. |
| **C++ Toolchain** | C++ compiler with **C++17** support | Must support C++ threading features (e.g., G++/Clang). |
| **WebAssembly** | **Emscripten SDK** | Required for C++ to `.wasm` compilation. |
| **Web Server** | **Node.js** and **npm** | Used to install and run a local server to host the WASM component. |

### Dependencies (C++ Component)

* **CPR library:** Used for handling external API requests (e.g., fetching new puzzles).
* **nlohmann/json:** Used for parsing and manipulating JSON data from the API.

---
## Code Structure

- sudoku_wasm.cpp: Core C++ solving algorithm with multi-threading
- sudoku-wasm-wrapper.js: JavaScript bridge for WebAssembly integration
- index.html: Web interface with puzzle visualization
- sudoku.js: Generated JavaScript glue code from Emscripten compilation
- sudoku.wasm: Compiled WebAssembly binary containing the solver logic
- CMakeLists.txt: Build configuration for the C++ component


---

## Build and Run Instructions

### 1. Local C++ Executable (CLI/Testing)

You can compile the core C++ logic into a standalone command-line executable for local testing of the multi-threading performance.

```bash
# Clone the repository
git clone [https://github.com/SuryaM-720s/Threadoku.git](https://github.com/SuryaM-720s/Threadoku.git)
cd Threadoku

# Create and enter the build directory
mkdir build && cd build

# Configure the project with CMake
cmake ..

# Build the executable
make

# Example Usage (The executable name and arguments may vary based on your Makefile)
# ./threadoku_solver --solve easy.txt
```
---

## Acknowledgments
Sudoku API for puzzle generation

