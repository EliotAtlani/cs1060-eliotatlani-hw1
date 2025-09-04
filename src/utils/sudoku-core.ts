import { Board, CellValue, Position } from '../types/sudoku';

// Core Sudoku utilities
export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

export function isValidNumber(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c !== col && board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r !== row && board[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }

  return true;
}

export function findConflicts(board: Board): Position[] {
  const conflicts: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row][col];
      if (value !== null && !isValidNumber(board, row, col, value)) {
        conflicts.push({ row, col });
      }
    }
  }
  
  return conflicts;
}

export function isComplete(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) return false;
    }
  }
  return findConflicts(board).length === 0;
}

export function getPossibleValues(board: Board, row: number, col: number): number[] {
  if (board[row][col] !== null) return [];
  
  const possible: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidNumber(board, row, col, num)) {
      possible.push(num);
    }
  }
  return possible;
}

export function getEmptyCells(board: Board): Position[] {
  const empty: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

export function getRowCells(row: number): Position[] {
  return Array(BOARD_SIZE).fill(null).map((_, col) => ({ row, col }));
}

export function getColumnCells(col: number): Position[] {
  return Array(BOARD_SIZE).fill(null).map((_, row) => ({ row, col }));
}

export function getBoxCells(boxRow: number, boxCol: number): Position[] {
  const cells: Position[] = [];
  const startRow = boxRow * BOX_SIZE;
  const startCol = boxCol * BOX_SIZE;
  
  for (let r = startRow; r < startRow + BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + BOX_SIZE; c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

export function getCellBox(row: number, col: number): { boxRow: number; boxCol: number } {
  return {
    boxRow: Math.floor(row / BOX_SIZE),
    boxCol: Math.floor(col / BOX_SIZE)
  };
}

// Seeded random number generator for deterministic puzzle generation
export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}