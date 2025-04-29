// Import the compiled WebAssembly module
import SudokuModule from './sudoku.js';

export default class SudokuSolver {
    constructor() {
        this.moduleLoaded = false;
        this.module = null;
        
        // Initialize the module automatically
        this.init();
    }
    
    // Asynchronously load the WebAssembly module
    async init() {
        try {
            this.module = await SudokuModule();
            this.moduleLoaded = true;
            console.log("WebAssembly Sudoku Module loaded successfully!");
        } catch (error) {
            console.error("Failed to load WebAssembly module:", error);
        }
    }
    
    isModuleLoaded() {
        return this.moduleLoaded;
    }
    
    // Convert JavaScript 2D array to WASM vector format
    // WASM can't directly use JS arrays, so we need this conversion
    convertBoardToWasm(board) {
        const wasmVectorInt = new this.module.VectorInt();
        const wasmBoard = new this.module.VectorVectorInt();
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                wasmVectorInt.push_back(board[i][j]);
            }
            wasmBoard.push_back(wasmVectorInt);
            // Free the row vector to prevent memory leaks
            wasmVectorInt.delete();
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
        }
        
        return board;
    }
    
    // Use C++ threading to check if a number is valid at a position
    checkValid(board, row, col, num) {
        if (!this.moduleLoaded) {
            throw new Error("WebAssembly module not loaded yet");
        }
        
        const wasmBoard = this.convertBoardToWasm(board);
        const isValid = this.module.isValid(wasmBoard, row, col, num);
        
        // Clean up WASM memory
        wasmBoard.delete();
        
        return isValid;
    }
    
    // Solve the Sudoku puzzle using the C++ backtracking algorithm
    solve(board) {
        if (!this.moduleLoaded) {
            throw new Error("WebAssembly module not loaded yet");
        }
        
        const wasmBoard = this.convertBoardToWasm(board);
        const solvedWasmBoard = this.module.solveSudoku(wasmBoard);
        
        const solvedBoard = this.convertWasmToBoard(solvedWasmBoard);
        
        // Clean up WASM memory
        wasmBoard.delete();
        solvedWasmBoard.delete();
        
        return solvedBoard;
    }
}