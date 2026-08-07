#include <emscripten/bind.h>
#include <vector>
#include <thread>
#include <mutex>
#include <atomic>

using namespace std;
// Don't use "using namespace emscripten" to avoid naming conflicts

const int N = 9;  // Size of Sudoku board

// Sequential on purpose: 27 comparisons is far less work than spawning a thread
bool isValid(const vector<vector<int>>& board, int row, int col, int num) {
    for (int i = 0; i < N; i++)
        if (board[row][i] == num || board[i][col] == num) return false;

    // Top-left corner of the 3x3 box containing this cell
    int boxRow = row - row % 3, boxCol = col - col % 3;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[boxRow + i][boxCol + j] == num) return false;

    return true;
}

// Locate the next empty cell in row-major order
bool findEmptyCell(const vector<vector<int>>& board, int& row, int& col) {
    for (int r = 0; r < N; r++)
        for (int c = 0; c < N; c++)
            if (board[r][c] == 0) {
                row = r;
                col = c;
                return true;
            }
    return false;
}

// Backtracking on one branch's private board; bails out once another branch wins
bool solveSequential(vector<vector<int>>& board, const atomic<bool>& solved) {
    if (solved.load(memory_order_relaxed)) return false;

    int row, col;
    if (!findEmptyCell(board, row, col)) return true;  // no empty cells - done

    for (int num = 1; num <= N; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (solveSequential(board, solved)) return true;

            board[row][col] = 0;  // backtrack
        }
    }
    return false;
}

// Wrapper function for JavaScript to call.
// One thread per candidate for the first empty cell; first to finish wins.
vector<vector<int>> solveBoardWrapper(const vector<vector<int>>& inputBoard) {
    vector<vector<int>> board = inputBoard;

    int row, col;
    if (!findEmptyCell(board, row, col)) return board;  // already complete

    vector<int> candidates;
    for (int num = 1; num <= N; num++)
        if (isValid(board, row, col, num)) candidates.push_back(num);

    if (candidates.empty()) return board;  // unsolvable as given

    atomic<bool> solved(false);
    mutex resultMutex;
    vector<vector<int>> solution;
    vector<thread> branches;
    branches.reserve(candidates.size());

    for (int num : candidates) {
        branches.emplace_back([&, num] {
            vector<vector<int>> localBoard = board;  // private copy per branch
            localBoard[row][col] = num;

            if (solveSequential(localBoard, solved)) {
                // Exactly one winner even if two branches finish together
                bool expected = false;
                if (solved.compare_exchange_strong(expected, true)) {
                    lock_guard<mutex> lock(resultMutex);
                    solution = localBoard;
                }
            }
        });
    }

    for (thread& t : branches) t.join();

    return solved.load() ? solution : board;
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
