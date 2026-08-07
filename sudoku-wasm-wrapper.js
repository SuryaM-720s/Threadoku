// Import the compiled WebAssembly module
import SudokuModule from './sudoku.js';

export default class SudokuSolver {
    constructor() {
        this.module = null;
        this.ready = this.init();
    }

    // Asynchronously load the WebAssembly module
    async init() {
        if (typeof SharedArrayBuffer === 'undefined') {
            throw new Error(
                'SharedArrayBuffer unavailable - the page is not cross-origin isolated. ' +
                'The pthreads WASM build cannot start without it.'
            );
        }

        this.module = await SudokuModule();
        return this.module;
    }

    isModuleLoaded() {
        return this.module !== null;
    }

    // Convert JavaScript 2D array to WASM vector format.
    // Each row needs a fresh VectorInt; push_back copies it, so delete after pushing.
    convertBoardToWasm(board) {
        const wasmBoard = new this.module.VectorVectorInt();

        for (let i = 0; i < 9; i++) {
            const row = new this.module.VectorInt();
            for (let j = 0; j < 9; j++) {
                row.push_back(board[i][j]);
            }
            wasmBoard.push_back(row);
            row.delete();
        }

        return wasmBoard;
    }

    // Convert WASM vector back to JavaScript 2D array
    convertWasmToBoard(wasmBoard) {
        const board = Array(9).fill().map(() => Array(9).fill(0));

        for (let i = 0; i < 9; i++) {
            const row = wasmBoard.get(i);
            for (let j = 0; j < 9; j++) {
                board[i][j] = row.get(j);
            }
            row.delete();
        }

        return board;
    }

    // Check whether a number may legally go in a cell (single call into C++)
    checkValid(board, row, col, num) {
        this.assertLoaded();

        const wasmBoard = this.convertBoardToWasm(board);
        try {
            return this.module.isValid(wasmBoard, row, col, num);
        } finally {
            wasmBoard.delete();
        }
    }

    // Solve the puzzle in C++
    solve(board) {
        this.assertLoaded();

        const wasmBoard = this.convertBoardToWasm(board);
        let solvedWasmBoard = null;

        try {
            solvedWasmBoard = this.module.solveSudoku(wasmBoard);
            return this.convertWasmToBoard(solvedWasmBoard);
        } finally {
            wasmBoard.delete();
            if (solvedWasmBoard) solvedWasmBoard.delete();
        }
    }

    assertLoaded() {
        if (!this.module) {
            throw new Error('WebAssembly module not loaded yet - await solver.ready first');
        }
    }
}
