import { useEffect } from 'react';
import { Position } from '../types/sudoku';

interface UseKeyboardProps {
  selectedCell: Position | null;
  onSelectCell: (position: Position | null) => void;
  onNumberInput: (num: number) => void;
  onDelete: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isGameActive: boolean;
}

export function useKeyboard({
  selectedCell,
  onSelectCell,
  onNumberInput,
  onDelete,
  onNewGame,
  onUndo,
  onRedo,
  onToggleNotes,
  onHint,
  canUndo,
  canRedo,
  isGameActive
}: UseKeyboardProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Prevent default behavior for game keys
      if (isGameActive) {
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
                         'Backspace', 'Delete', 'Space', 'Escape'];
        if (gameKeys.includes(event.key) || 
            (event.key >= '1' && event.key <= '9') ||
            (event.ctrlKey && ['z', 'y', 'n', 'h'].includes(event.key.toLowerCase()))) {
          event.preventDefault();
        }
      }

      // Handle different key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            if (event.shiftKey && canRedo) {
              onRedo();
            } else if (canUndo) {
              onUndo();
            }
            break;
          case 'y':
            if (canRedo) {
              onRedo();
            }
            break;
          case 'n':
            onNewGame();
            break;
          case 'h':
            if (isGameActive) {
              onHint();
            }
            break;
        }
        return;
      }

      if (!isGameActive) return;

      switch (event.key) {
        case 'ArrowUp':
          if (selectedCell) {
            const newRow = Math.max(0, selectedCell.row - 1);
            onSelectCell({ ...selectedCell, row: newRow });
          } else {
            onSelectCell({ row: 8, col: 4 });
          }
          break;

        case 'ArrowDown':
          if (selectedCell) {
            const newRow = Math.min(8, selectedCell.row + 1);
            onSelectCell({ ...selectedCell, row: newRow });
          } else {
            onSelectCell({ row: 0, col: 4 });
          }
          break;

        case 'ArrowLeft':
          if (selectedCell) {
            const newCol = Math.max(0, selectedCell.col - 1);
            onSelectCell({ ...selectedCell, col: newCol });
          } else {
            onSelectCell({ row: 4, col: 8 });
          }
          break;

        case 'ArrowRight':
          if (selectedCell) {
            const newCol = Math.min(8, selectedCell.col + 1);
            onSelectCell({ ...selectedCell, col: newCol });
          } else {
            onSelectCell({ row: 4, col: 0 });
          }
          break;

        case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9':
          onNumberInput(parseInt(event.key, 10));
          break;

        case 'Backspace':
        case 'Delete':
        case '0':
          onDelete();
          break;

        case ' ':
          onToggleNotes();
          break;

        case 'Escape':
          onSelectCell(null);
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedCell,
    onSelectCell,
    onNumberInput,
    onDelete,
    onNewGame,
    onUndo,
    onRedo,
    onToggleNotes,
    onHint,
    canUndo,
    canRedo,
    isGameActive
  ]);
}