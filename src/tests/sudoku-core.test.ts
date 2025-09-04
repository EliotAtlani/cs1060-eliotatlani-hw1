import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  isValidNumber,
  findConflicts,
  isComplete,
  getPossibleValues,
  SeededRandom
} from '../utils/sudoku-core';

describe('Sudoku Core Functions', () => {
  describe('createEmptyBoard', () => {
    it('should create a 9x9 board filled with nulls', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(9);
      expect(board[0]).toHaveLength(9);
      expect(board.every(row => row.every(cell => cell === null))).toBe(true);
    });
  });

  describe('isValidNumber', () => {
    it('should return true for valid placement', () => {
      const board = createEmptyBoard();
      expect(isValidNumber(board, 0, 0, 1)).toBe(true);
    });

    it('should return false for row conflict', () => {
      const board = createEmptyBoard();
      board[0][1] = 5;
      expect(isValidNumber(board, 0, 0, 5)).toBe(false);
    });

    it('should return false for column conflict', () => {
      const board = createEmptyBoard();
      board[1][0] = 5;
      expect(isValidNumber(board, 0, 0, 5)).toBe(false);
    });

    it('should return false for box conflict', () => {
      const board = createEmptyBoard();
      board[1][1] = 5;
      expect(isValidNumber(board, 0, 0, 5)).toBe(false);
    });
  });

  describe('findConflicts', () => {
    it('should return empty array for valid board', () => {
      const board = createEmptyBoard();
      board[0][0] = 1;
      board[0][1] = 2;
      const conflicts = findConflicts(board);
      expect(conflicts).toHaveLength(0);
    });

    it('should find row conflicts', () => {
      const board = createEmptyBoard();
      board[0][0] = 5;
      board[0][1] = 5;
      const conflicts = findConflicts(board);
      expect(conflicts).toHaveLength(2);
    });
  });

  describe('isComplete', () => {
    it('should return false for incomplete board', () => {
      const board = createEmptyBoard();
      expect(isComplete(board)).toBe(false);
    });

    it('should return false for complete but invalid board', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(1));
      expect(isComplete(board)).toBe(false);
    });
  });

  describe('getPossibleValues', () => {
    it('should return all numbers 1-9 for empty cell in empty board', () => {
      const board = createEmptyBoard();
      const possible = getPossibleValues(board, 0, 0);
      expect(possible).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should exclude numbers based on constraints', () => {
      const board = createEmptyBoard();
      board[0][1] = 1; // row constraint
      board[1][0] = 2; // column constraint
      board[1][1] = 3; // box constraint
      
      const possible = getPossibleValues(board, 0, 0);
      expect(possible).not.toContain(1);
      expect(possible).not.toContain(2);
      expect(possible).not.toContain(3);
      expect(possible).toContain(4);
    });
  });

  describe('SeededRandom', () => {
    it('should produce deterministic results with same seed', () => {
      const rng1 = new SeededRandom('test');
      const rng2 = new SeededRandom('test');
      
      const values1 = Array(10).fill(0).map(() => rng1.next());
      const values2 = Array(10).fill(0).map(() => rng2.next());
      
      expect(values1).toEqual(values2);
    });

    it('should produce different results with different seeds', () => {
      const rng1 = new SeededRandom('test1');
      const rng2 = new SeededRandom('test2');
      
      const values1 = Array(10).fill(0).map(() => rng1.next());
      const values2 = Array(10).fill(0).map(() => rng2.next());
      
      expect(values1).not.toEqual(values2);
    });

    it('should shuffle arrays deterministically', () => {
      const rng1 = new SeededRandom('test');
      const rng2 = new SeededRandom('test');
      
      const arr = [1, 2, 3, 4, 5];
      const shuffled1 = rng1.shuffle(arr);
      const shuffled2 = rng2.shuffle(arr);
      
      expect(shuffled1).toEqual(shuffled2);
      expect(shuffled1).not.toEqual(arr); // Should be different from original
    });
  });
});