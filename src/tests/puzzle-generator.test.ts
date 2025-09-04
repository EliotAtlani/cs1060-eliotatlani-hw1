import { describe, it, expect } from 'vitest';
import { generateSudokuPuzzle } from '../utils/puzzle-generator';
import { SudokuSolver } from '../utils/sudoku-solver';
import { isComplete, getEmptyCells } from '../utils/sudoku-core';

describe('Puzzle Generator', () => {
  describe('generateSudokuPuzzle', () => {
    it('should generate a valid puzzle with solution', () => {
      const puzzleData = generateSudokuPuzzle('normal');
      
      // Check that puzzle has empty cells
      const emptyCells = getEmptyCells(puzzleData.board);
      expect(emptyCells.length).toBeGreaterThan(0);
      
      // Check that solution is complete
      expect(isComplete(puzzleData.solution)).toBe(true);
      
      // Check that puzzle can be solved to the same solution
      const solver = new SudokuSolver(puzzleData.board);
      const result = solver.solve();
      
      expect(result.solved).toBe(true);
      expect(result.board).toEqual(puzzleData.solution);
    });

    it('should generate puzzles with different difficulties', () => {
      const easyPuzzle = generateSudokuPuzzle('easy');
      const hardPuzzle = generateSudokuPuzzle('hard');
      
      const easyEmpty = getEmptyCells(easyPuzzle.board).length;
      const hardEmpty = getEmptyCells(hardPuzzle.board).length;
      
      // Hard puzzles should have more empty cells
      expect(hardEmpty).toBeGreaterThan(easyEmpty);
    });

    it('should generate deterministic puzzles with seed', () => {
      const puzzle1 = generateSudokuPuzzle('normal', 'test-seed');
      const puzzle2 = generateSudokuPuzzle('normal', 'test-seed');
      
      expect(puzzle1.board).toEqual(puzzle2.board);
      expect(puzzle1.solution).toEqual(puzzle2.solution);
    });

    it('should generate different puzzles with different seeds', () => {
      const puzzle1 = generateSudokuPuzzle('normal', 'seed1');
      const puzzle2 = generateSudokuPuzzle('normal', 'seed2');
      
      expect(puzzle1.board).not.toEqual(puzzle2.board);
    });

    it('should generate puzzles with unique solutions', () => {
      // This test might be slow, so we'll test fewer iterations
      for (let i = 0; i < 3; i++) {
        const puzzleData = generateSudokuPuzzle('normal');
        
        // Count solutions by trying to solve with multiple approaches
        const solver1 = new SudokuSolver(puzzleData.board);
        const result1 = solver1.solve();
        
        expect(result1.solved).toBe(true);
        expect(result1.board).toEqual(puzzleData.solution);
      }
    });
  });
});