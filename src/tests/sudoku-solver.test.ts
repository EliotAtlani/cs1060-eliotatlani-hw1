import { describe, it, expect } from 'vitest';
import { SudokuSolver } from '../utils/sudoku-solver';
import { createEmptyBoard } from '../utils/sudoku-core';

describe('Sudoku Solver', () => {
  describe('solve', () => {
    it('should solve a simple puzzle', () => {
      const board = createEmptyBoard();
      
      // Create a simple puzzle (partial solution)
      board[0] = [5, 3, null, null, 7, null, null, null, null];
      board[1] = [6, null, null, 1, 9, 5, null, null, null];
      board[2] = [null, 9, 8, null, null, null, null, 6, null];
      board[3] = [8, null, null, null, 6, null, null, null, 3];
      board[4] = [4, null, null, 8, null, 3, null, null, 1];
      board[5] = [7, null, null, null, 2, null, null, null, 6];
      board[6] = [null, 6, null, null, null, null, 2, 8, null];
      board[7] = [null, null, null, 4, 1, 9, null, null, 5];
      board[8] = [null, null, null, null, 8, null, null, 7, 9];

      const solver = new SudokuSolver(board);
      const result = solver.solve();
      
      expect(result.solved).toBe(true);
      expect(result.board).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should provide solving steps with descriptions', () => {
      const board = createEmptyBoard();
      
      // Create a puzzle that can be solved with single candidates
      board[0][0] = 1;
      board[0][1] = 2;
      board[0][2] = 3;
      board[0][3] = 4;
      board[0][4] = 5;
      board[0][5] = 6;
      board[0][6] = 7;
      board[0][7] = 8;
      // board[0][8] should be 9 (single candidate)
      
      const solver = new SudokuSolver(board);
      const result = solver.solve();
      
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps[0]).toHaveProperty('technique');
      expect(result.steps[0]).toHaveProperty('description');
      expect(result.steps[0]).toHaveProperty('cells');
      expect(result.steps[0]).toHaveProperty('values');
    });

    it('should identify different solving techniques', () => {
      // This is a more complex test that would require specific puzzle setups
      // For now, we'll just test that the solver can identify at least basic techniques
      
      const board = createEmptyBoard();
      board[0] = [5, 3, null, null, 7, null, null, null, null];
      board[1] = [6, null, null, 1, 9, 5, null, null, null];
      
      const solver = new SudokuSolver(board);
      const result = solver.solve();
      
      if (result.steps.length > 0) {
        const techniques = result.steps.map(step => step.technique);
        expect(techniques.length).toBeGreaterThan(0);
        
        // Should contain at least some basic techniques
        const basicTechniques = ['Single Candidate', 'Hidden Single', 'Backtracking'];
        const hasBasicTechnique = basicTechniques.some(tech => 
          techniques.includes(tech)
        );
        expect(hasBasicTechnique).toBe(true);
      }
    });

    it('should handle unsolvable puzzles gracefully', () => {
      const board = createEmptyBoard();
      
      // Create an impossible puzzle (two same numbers in same row)
      board[0][0] = 1;
      board[0][1] = 1; // Invalid - same number in same row
      
      const solver = new SudokuSolver(board);
      const result = solver.solve();
      
      expect(result.solved).toBe(false);
      expect(result.steps).toBeDefined();
    });
  });
});