cmake_minimum_required(VERSION 3.14)
project(Threadoku CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT EMSCRIPTEN)
    message(FATAL_ERROR "Configure with Emscripten: emcmake cmake ..")
endif()

# Emit sudoku.js / sudoku.wasm next to index.html, which expects them there
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})

add_executable(sudoku sudoku_wasm.cpp)
set_target_properties(sudoku PROPERTIES SUFFIX ".js")

target_compile_options(sudoku PRIVATE -O3 -pthread)

target_link_options(sudoku PRIVATE
    -O3
    -lembind
    -pthread
    -sPTHREAD_POOL_SIZE=9
    -sMODULARIZE=1
    -sEXPORT_ES6=1
    -sEXPORT_NAME=SudokuModule
    -sALLOW_MEMORY_GROWTH=1
    -sENVIRONMENT=web,worker,node
)
