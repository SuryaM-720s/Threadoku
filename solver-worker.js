// Keeps the solver off the main thread, since solveSudoku blocks in pthread_join

import SudokuSolver from './sudoku-wasm-wrapper.js';

const solver = new SudokuSolver();

solver.ready.then(
    () => self.postMessage({ type: 'ready' }),
    (err) => self.postMessage({ type: 'error', error: String(err.message || err) })
);

self.onmessage = async (event) => {
    const { id, board } = event.data;

    try {
        await solver.ready;

        const start = performance.now();
        const solution = solver.solve(board);
        const elapsedMs = performance.now() - start;

        self.postMessage({ type: 'solved', id, solution, elapsedMs });
    } catch (err) {
        self.postMessage({ type: 'error', id, error: String(err.message || err) });
    }
};
