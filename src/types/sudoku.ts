// Core types for the Sudoku game
export type CellValue = number | null;
export type Board = CellValue[][];
export type NotesBoard = Set<number>[][];

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  value: CellValue;
  notes: Set<number>;
  isGiven: boolean;
  isHighlighted: boolean;
  hasConflict: boolean;
  isIncorrect: boolean;
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameState {
  board: Cell[][];
  selectedCell: Position | null;
  isNotesMode: boolean;
  isComplete: boolean;
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
  moves: GameMove[];
  currentMoveIndex: number;
  errorCount: number;
  isGameOver: boolean;
}

export interface GameMove {
  position: Position;
  previousValue: CellValue;
  newValue: CellValue;
  previousNotes: Set<number>;
  newNotes: Set<number>;
  timestamp: number;
  wasError: boolean;
}

export interface PuzzleData {
  board: Board;
  solution: Board;
  difficulty: Difficulty;
  seed?: string;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  totalTime: number;
  bestTimes: {
    easy: number | null;
    normal: number | null;
    hard: number | null;
  };
}

export interface SolverStep {
  technique: string;
  description: string;
  cells: Position[];
  values: number[];
  eliminatedNotes?: { position: Position; values: number[] }[];
}

export interface SolverResult {
  solved: boolean;
  steps: SolverStep[];
  board?: Board;
}