import React from 'react';
import { Cell, Position } from '../types/sudoku';
import { SudokuCell } from './SudokuCell';

interface SudokuBoardProps {
  board: Cell[][];
  selectedCell: Position | null;
  onCellClick: (position: Position) => void;
  highlightedCells?: Position[];
  className?: string;
}

export function SudokuBoard({ 
  board, 
  selectedCell, 
  onCellClick, 
  highlightedCells = [],
  className = '' 
}: SudokuBoardProps) {
  const handleBoardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to background
  };

  return (
    <div 
      className={`sudoku-board grid grid-cols-9 gap-0 bg-gray-900 border-2 border-cyan-500 p-3 rounded-lg shadow-2xl cyber-glow ${className}`}
      onClick={handleBoardClick}
      style={{
        boxShadow: `
          0 0 20px rgba(6, 182, 212, 0.4),
          0 0 40px rgba(16, 185, 129, 0.2),
          inset 0 0 20px rgba(6, 182, 212, 0.1)
        `
      }}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position = { row: rowIndex, col: colIndex };
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isHighlighted = highlightedCells.some(
            pos => pos.row === rowIndex && pos.col === colIndex
          );
          const isRelated = selectedCell && (
            selectedCell.row === rowIndex ||
            selectedCell.col === colIndex ||
            (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
             Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
          );

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              position={position}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isRelated={isRelated}
              onClick={() => onCellClick(position)}
            />
          );
        })
      )}
    </div>
  );
}