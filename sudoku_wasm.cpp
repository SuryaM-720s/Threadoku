#include <emscripten.h>
#include <emscripten/bind.h>
#include <vector>
#include <thread>
#include <mutex>

using namespace std;
// Don't use "using namespace emscripten" to avoid naming conflicts

const int N = 9;  // Size of Sudoku board
mutex mtx;

// Global flags for thread communication
bool rowValid, colValid, boxValid;

// Check if a number already exists in the same row
bool isRowValid(const vector<vector<int>>& board, int row, int num) {
    for (int col = 0; col < N; col++)
        if (board[row][col] == num) return false;
    return true;
}

// Check if a number already exists in the same column
bool isColValid(const vector<vector<int>>& board, int col, int num) {
    for (int row = 0; row < N; row++)
        if (board[row][col] == num) return false;
    return true;
}

// Check if a number already exists in the same 3x3 box
bool isBoxValid(const vector<vector<int>>& board, int startRow, int startCol, int num) {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[i + startRow][j + startCol] == num) return false;
    return true;
}

// Perform all validation checks in parallel using threads
bool isValid(const vector<vector<int>>& board, int row, int col, int num) {
    rowValid = colValid = boxValid = false;

    // Launch three threads, one for each validation check
    thread t1([&] {
        rowValid = isRowValid(board, row, num);
    });

    thread t2([&] {
        colValid = isColValid(board, col, num);
    });

    thread t3([&] {
        // Calculate top-left corner of 3x3 box containing this cell
        boxValid = isBoxValid(board, row - row % 3, col - col % 3, num);
    });

    // Wait for all threads to complete
    t1.join(); t2.join(); t3.join();

    return rowValid && colValid && boxValid;
}

// Recursive backtracking algorithm to solve the Sudoku puzzle
bool solveSudoku(vector<vector<int>>& board) {
    for (int row = 0; row < N; row++) {
        for (int col = 0; col < N; col++) {
            // Find an empty cell
            if (board[row][col] == 0) {
                // Try each number 1-9
                for (int num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;  // Place the number
                        
                        if (solveSudoku(board))  // Recursive call
                            return true;
                            
                        board[row][col] = 0;  // Backtrack if needed
                    }
                }
                return false;  // No valid number found
            }
        }
    }
    return true;  // All cells filled - puzzle solved
}

// Wrapper function for JavaScript to call
vector<vector<int>> solveBoardWrapper(const vector<vector<int>>& inputBoard) {
    vector<vector<int>> board = inputBoard;
    solveSudoku(board);
    return board;
}

// Binding code to make C++ functions available to JavaScript
EMSCRIPTEN_BINDINGS(sudoku_module) {
    // Register vector types
    emscripten::register_vector<int>("VectorInt");
    emscripten::register_vector<vector<int>>("VectorVectorInt");
    
    // Expose functions to JavaScript
    emscripten::function("solveSudoku", &solveBoardWrapper);
    emscripten::function("isValid", &isValid);
}