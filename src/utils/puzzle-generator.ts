import { Board, Difficulty, PuzzleData } from '../types/sudoku';
import { 
  createEmptyBoard, 
  cloneBoard, 
  isValidNumber, 
  getEmptyCells, 
  SeededRandom,
  BOARD_SIZE 
} from './sudoku-core';
import { SudokuSolver } from './sudoku-solver';

export class PuzzleGenerator {
  private random: SeededRandom;

  constructor(seed?: string | number) {
    this.random = new SeededRandom(seed || Date.now());
  }

  generatePuzzle(difficulty: Difficulty, seed?: string): PuzzleData {
    if (seed) {
      this.random = new SeededRandom(seed);
    }

    // Generate a complete solution
    const solution = this.generateCompleteSolution();
    
    // Create puzzle by removing numbers
    const puzzle = this.createPuzzleFromSolution(solution, difficulty);
    
    return {
      board: puzzle,
      solution,
      difficulty,
      seed
    };
  }

  private generateCompleteSolution(): Board {
    const board = createEmptyBoard();
    this.fillBoard(board);
    return board;
  }

  private fillBoard(board: Board): boolean {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return true;

    const cell = emptyCells[0];
    const numbers = this.random.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (isValidNumber(board, cell.row, cell.col, num)) {
        board[cell.row][cell.col] = num;
        if (this.fillBoard(board)) {
          return true;
        }
        board[cell.row][cell.col] = null;
      }
    }

    return false;
  }

  private createPuzzleFromSolution(solution: Board, difficulty: Difficulty): Board {
    const puzzle = cloneBoard(solution);
    const cellsToRemove = this.getCellsToRemove(difficulty);
    
    // Get all cell positions
    const positions = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        positions.push({ row, col });
      }
    }

    // Shuffle positions
    const shuffledPositions = this.random.shuffle(positions);
    let removed = 0;

    for (const pos of shuffledPositions) {
      if (removed >= cellsToRemove) break;

      const originalValue = puzzle[pos.row][pos.col];
      puzzle[pos.row][pos.col] = null;

      // Check if puzzle still has unique solution
      if (this.hasUniqueSolution(puzzle)) {
        removed++;
      } else {
        // Restore the value if removing it creates multiple solutions
        puzzle[pos.row][pos.col] = originalValue;
      }
    }

    return puzzle;
  }

  private getCellsToRemove(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return this.random.nextInt(40, 45);
      case 'normal': return this.random.nextInt(46, 55);
      case 'hard': return this.random.nextInt(56, 64);
      default: return 50;
    }
  }

  private hasUniqueSolution(board: Board): boolean {
    const solutions = this.countSolutions(cloneBoard(board), 2);
    return solutions === 1;
  }

  private countSolutions(board: Board, maxSolutions: number): number {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return 1;

    const cell = emptyCells[0];
    let solutionCount = 0;

    for (let num = 1; num <= 9; num++) {
      if (isValidNumber(board, cell.row, cell.col, num)) {
        board[cell.row][cell.col] = num;
        solutionCount += this.countSolutions(board, maxSolutions);
        board[cell.row][cell.col] = null;

        if (solutionCount >= maxSolutions) {
          return solutionCount;
        }
      }
    }

    return solutionCount;
  }
}

// Factory function for generating puzzles
export function generateSudokuPuzzle(difficulty: Difficulty, seed?: string): PuzzleData {
  const generator = new PuzzleGenerator(seed);
  return generator.generatePuzzle(difficulty, seed);
}