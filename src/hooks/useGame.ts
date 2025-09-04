import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameState, 
  GameMove, 
  Position, 
  Cell, 
  CellValue, 
  PuzzleData, 
  Difficulty,
  GameStats,
  SolverStep,
  Board
} from '../types/sudoku';
import { 
  createEmptyBoard, 
  cloneBoard, 
  findConflicts, 
  isComplete as checkIsComplete,
  BOARD_SIZE
} from '../utils/sudoku-core';
import { generateSudokuPuzzle } from '../utils/puzzle-generator';
import { SudokuSolver } from '../utils/sudoku-solver';
import { 
  saveGameState, 
  loadGameState, 
  clearGameState, 
  savePuzzleData, 
  loadPuzzleData,
  saveGameStats,
  loadGameStats
} from '../utils/game-persistence';

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [stats, setStats] = useState<GameStats>(loadGameStats);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save game state
  useEffect(() => {
    if (gameState && puzzleData) {
      saveGameState(gameState);
      savePuzzleData(puzzleData);
    }
  }, [gameState, puzzleData]);

  // Auto-save stats
  useEffect(() => {
    saveGameStats(stats);
  }, [stats]);

  // Timer management
  useEffect(() => {
    if (isPlaying && gameState && !gameState.isComplete) {
      timerRef.current = setInterval(() => {
        setGameState(prev => prev ? {
          ...prev,
          elapsedTime: Date.now() - prev.startTime
        } : null);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, gameState?.isComplete]);

  // Load saved game on mount
  useEffect(() => {
    const savedGameState = loadGameState();
    const savedPuzzleData = loadPuzzleData();
    
    if (savedGameState && savedPuzzleData) {
      setGameState(savedGameState);
      setPuzzleData(savedPuzzleData);
      setIsPlaying(!savedGameState.isComplete);
    }
  }, []);

  const newGame = useCallback((difficulty: Difficulty, seed?: string) => {
    const puzzle = generateSudokuPuzzle(difficulty, seed);
    const board = createBoardFromPuzzle(puzzle.board);
    
    const newGameState: GameState = {
      board,
      selectedCell: null,
      isNotesMode: false,
      isComplete: false,
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: 0,
      moves: [],
      currentMoveIndex: -1,
      errorCount: 0,
      isGameOver: false
    };

    setGameState(newGameState);
    setPuzzleData(puzzle);
    setIsPlaying(true);
  }, []);

  const resumeGame = useCallback(() => {
    if (gameState && !gameState.isComplete) {
      setIsPlaying(true);
    }
  }, [gameState, puzzleData]);

  const pauseGame = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const selectCell = useCallback((position: Position | null) => {
    setGameState(prev => prev ? { ...prev, selectedCell: position } : null);
  }, []);

  const toggleNotesMode = useCallback(() => {
    setGameState(prev => prev ? { ...prev, isNotesMode: !prev.isNotesMode } : null);
  }, []);

  const makeMove = useCallback((position: Position, value: CellValue, isNote = false) => {
    if (!gameState || gameState.isComplete || gameState.isGameOver) return;

    const { row, col } = position;
    const cell = gameState.board[row][col];
    
    if (cell.isGiven) return;

    setGameState(prev => {
      if (!prev) return null;

      const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: new Set(c.notes) })));
      const targetCell = newBoard[row][col];
      let newErrorCount = prev.errorCount;

      // Create move record (we'll update wasError after we check for conflicts)
      const move: GameMove = {
        position,
        previousValue: targetCell.value,
        newValue: isNote ? targetCell.value : value,
        previousNotes: new Set(targetCell.notes),
        newNotes: new Set(targetCell.notes),
        timestamp: Date.now(),
        wasError: false // Will be updated below
      };

      if (isNote && value !== null) {
        // Toggle note
        if (targetCell.notes.has(value)) {
          targetCell.notes.delete(value);
        } else {
          targetCell.notes.add(value);
        }
        move.newNotes = new Set(targetCell.notes);
      } else {
        // Set value
        targetCell.value = value;
        targetCell.notes.clear();
        move.newNotes = new Set();
      }

      // Check for errors: either rule violation OR incorrect solution
      const boardValues = newBoard.map(r => r.map(c => c.value));
      const conflicts = findConflicts(boardValues);
      const hasRuleViolation = !isNote && value !== null && conflicts.some(conflict => conflict.row === row && conflict.col === col);
      const hasIncorrectSolution = !isNote && value !== null && puzzleData && puzzleData.solution[row][col] !== value;
      const isError = hasRuleViolation || hasIncorrectSolution;
      
      // Update the move record with error status
      move.wasError = isError;

      if (isError) {
        newErrorCount++;
      }

      // Update conflicts display and incorrect cell marking
      newBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
          cell.hasConflict = conflicts.some(conflict => conflict.row === r && conflict.col === c);
          // Mark cell as incorrect if it has a value that doesn't match the solution
          cell.isIncorrect = cell.value !== null && puzzleData && puzzleData.solution[r][c] !== cell.value;
        });
      });

      // Check completion
      const isComplete = checkIsComplete(boardValues);
      const isGameOver = newErrorCount >= 3;

      // Update moves history
      const newMoves = prev.moves.slice(0, prev.currentMoveIndex + 1);
      newMoves.push(move);

      const newState = {
        ...prev,
        board: newBoard,
        moves: newMoves,
        currentMoveIndex: newMoves.length - 1,
        isComplete,
        errorCount: newErrorCount,
        isGameOver
      };

      // Handle game completion
      if (isComplete && !prev.isComplete) {
        const finalTime = Date.now() - prev.startTime;
        updateStats(puzzleData!.difficulty, finalTime, prev.hintsUsed === 0);
        setIsPlaying(false);
      }

      // Handle game over
      if (isGameOver) {
        setIsPlaying(false);
      }

      return newState;
    });
  }, [gameState, puzzleData]);

  const undo = useCallback(() => {
    if (!gameState || gameState.currentMoveIndex < 0) return;

    setGameState(prev => {
      if (!prev) return null;

      const moveToUndo = prev.moves[prev.currentMoveIndex];
      const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: new Set(c.notes) })));
      
      const targetCell = newBoard[moveToUndo.position.row][moveToUndo.position.col];
      targetCell.value = moveToUndo.previousValue;
      targetCell.notes = new Set(moveToUndo.previousNotes);

      // Update error count - subtract if this move was an error
      let newErrorCount = prev.errorCount;
      if (moveToUndo.wasError) {
        newErrorCount = Math.max(0, newErrorCount - 1);
      }

      // Update conflicts and incorrect cell marking
      const conflicts = findConflicts(newBoard.map(r => r.map(c => c.value)));
      newBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
          cell.hasConflict = conflicts.some(conflict => conflict.row === r && conflict.col === c);
          // Mark cell as incorrect if it has a value that doesn't match the solution
          cell.isIncorrect = cell.value !== null && puzzleData && puzzleData.solution[r][c] !== cell.value;
        });
      });

      return {
        ...prev,
        board: newBoard,
        currentMoveIndex: prev.currentMoveIndex - 1,
        isComplete: false,
        errorCount: newErrorCount,
        isGameOver: newErrorCount >= 3
      };
    });
  }, [gameState, puzzleData]);

  const redo = useCallback(() => {
    if (!gameState || gameState.currentMoveIndex >= gameState.moves.length - 1) return;

    setGameState(prev => {
      if (!prev) return null;

      const moveToRedo = prev.moves[prev.currentMoveIndex + 1];
      const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: new Set(c.notes) })));
      
      const targetCell = newBoard[moveToRedo.position.row][moveToRedo.position.col];
      targetCell.value = moveToRedo.newValue;
      targetCell.notes = new Set(moveToRedo.newNotes);

      // Update error count - add if this move was an error
      let newErrorCount = prev.errorCount;
      if (moveToRedo.wasError) {
        newErrorCount++;
      }

      // Update conflicts and incorrect cell marking
      const conflicts = findConflicts(newBoard.map(r => r.map(c => c.value)));
      newBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
          cell.hasConflict = conflicts.some(conflict => conflict.row === r && conflict.col === c);
          // Mark cell as incorrect if it has a value that doesn't match the solution
          cell.isIncorrect = cell.value !== null && puzzleData && puzzleData.solution[r][c] !== cell.value;
        });
      });

      const boardValues = newBoard.map(r => r.map(c => c.value));
      const isComplete = checkIsComplete(boardValues);

      return {
        ...prev,
        board: newBoard,
        currentMoveIndex: prev.currentMoveIndex + 1,
        isComplete,
        errorCount: newErrorCount,
        isGameOver: newErrorCount >= 3
      };
    });
  }, [gameState, puzzleData]);

  const getHint = useCallback((): SolverStep | null => {
    if (!gameState || !puzzleData) return null;

    const currentBoard = gameState.board.map(r => r.map(c => c.value));
    const solver = new SudokuSolver(currentBoard);
    const result = solver.solve();

    if (result.steps.length > 0) {
      setGameState(prev => prev ? { ...prev, hintsUsed: prev.hintsUsed + 1 } : null);
      return result.steps[0];
    }

    return null;
  }, [gameState, puzzleData]);

  const playNextStep = useCallback((): SolverStep | null => {
    if (!gameState || !puzzleData) return null;

    const currentBoard = gameState.board.map(r => r.map(c => c.value));
    const solver = new SudokuSolver(currentBoard);
    const result = solver.solve();

    if (result.steps.length > 0) {
      const step = result.steps[0];
      
      // Apply the step to the board
      if (step.cells.length === 1 && step.values.length === 1) {
        const position = step.cells[0];
        const value = step.values[0];
        makeMove(position, value);
      }

      return step;
    }

    return null;
  }, [gameState, puzzleData, makeMove]);

  const solvePuzzle = useCallback((): SolverStep[] => {
    if (!gameState || !puzzleData) return [];

    const currentBoard = gameState.board.map(r => r.map(c => c.value));
    const solver = new SudokuSolver(currentBoard);
    const result = solver.solve();

    if (result.solved && result.board) {
      // Apply solution to the board
      const newBoard = gameState.board.map(r => r.map(c => ({ ...c })));
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (newBoard[row][col].value === null) {
            newBoard[row][col].value = result.board[row][col];
            newBoard[row][col].notes.clear();
          }
        }
      }

      setGameState(prev => prev ? {
        ...prev,
        board: newBoard,
        isComplete: true
      } : null);

      setIsPlaying(false);
    }

    return result.steps;
  }, [gameState, puzzleData]);

  const updateStats = useCallback((difficulty: Difficulty, timeMs: number, perfect: boolean) => {
    setStats(prev => {
      const newStats = { ...prev };
      newStats.gamesPlayed++;
      newStats.gamesWon++;
      newStats.totalTime += timeMs;

      if (perfect) {
        newStats.currentStreak++;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
      } else {
        newStats.currentStreak = 0;
      }

      if (!newStats.bestTimes[difficulty] || timeMs < newStats.bestTimes[difficulty]!) {
        newStats.bestTimes[difficulty] = timeMs;
      }

      return newStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    const defaultStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalTime: 0,
      bestTimes: {
        easy: null,
        normal: null,
        hard: null
      }
    };
    setStats(defaultStats);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(null);
    setPuzzleData(null);
    setIsPlaying(false);
    clearGameState();
  }, []);

  return {
    gameState,
    puzzleData,
    stats,
    isPlaying,
    newGame,
    resumeGame,
    pauseGame,
    selectCell,
    toggleNotesMode,
    makeMove,
    undo,
    redo,
    getHint,
    playNextStep,
    solvePuzzle,
    resetGame,
    resetStats,
    canUndo: gameState?.currentMoveIndex !== undefined && gameState.currentMoveIndex >= 0,
    canRedo: gameState?.currentMoveIndex !== undefined && gameState.currentMoveIndex < gameState.moves.length - 1
  };
}

function createBoardFromPuzzle(puzzle: Board): Cell[][] {
  return puzzle.map(row =>
    row.map(value => ({
      value,
      notes: new Set<number>(),
      isGiven: value !== null,
      isHighlighted: false,
      hasConflict: false,
      isIncorrect: false
    }))
  );
}