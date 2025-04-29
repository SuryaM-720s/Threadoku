cmake_minimum_required(VERSION 3.14)
project(SudokuSolver)

set(CMAKE_CXX_STANDARD 17)

find_package(cpr REQUIRED)
find_package(nlohmann_json REQUIRED)

add_executable(sudoku sudoku_wasm.cpp)
target_link_libraries(sudoku PRIVATE cpr::cpr nlohmann_json::nlohmann_json)
