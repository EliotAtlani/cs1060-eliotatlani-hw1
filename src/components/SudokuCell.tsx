import React from 'react';
import { Cell, Position } from '../types/sudoku';

interface SudokuCellProps {
  cell: Cell;
  position: Position;
  isSelected: boolean;
  isHighlighted: boolean;
  isRelated: boolean;
  onClick: () => void;
}

export function SudokuCell({ 
  cell, 
  position, 
  isSelected, 
  isHighlighted, 
  isRelated, 
  onClick 
}: SudokuCellProps) {
  const { row, col } = position;
  
  const getBorderClasses = () => {
    const borders = [];
    
    // Thick borders for 3x3 box boundaries
    if (row % 3 === 0) borders.push('border-t-2');
    if (row % 3 === 2) borders.push('border-b-2');
    if (col % 3 === 0) borders.push('border-l-2');
    if (col % 3 === 2) borders.push('border-r-2');
    
    // Thin borders for cell separation
    if (row % 3 !== 0) borders.push('border-t');
    if (row % 3 !== 2) borders.push('border-b');
    if (col % 3 !== 0) borders.push('border-l');
    if (col % 3 !== 2) borders.push('border-r');
    
    return borders.join(' ');
  };

  const getBackgroundClasses = () => {
    if (cell.hasConflict) return 'bg-red-900 hover:bg-red-800 border-red-500';
    if (cell.isIncorrect) return 'bg-red-800 hover:bg-red-700 border-red-400';
    if (isSelected) return 'bg-cyan-900 hover:bg-cyan-800 border-cyan-400';
    if (isHighlighted) return 'bg-green-900 hover:bg-green-800 border-green-400';
    if (isRelated) return 'bg-gray-700 hover:bg-gray-600 border-purple-500';
    return 'bg-gray-800 hover:bg-gray-700 border-gray-600';
  };

  const getTextClasses = () => {
    if (cell.hasConflict) return 'text-red-400 font-bold cyber-text-glow-red';
    if (cell.isIncorrect) return 'text-red-300 font-bold cyber-text-glow-red';
    if (cell.isGiven) return 'text-cyan-300 font-bold cyber-text-glow-cyan';
    if (cell.value) return 'text-green-400 font-semibold cyber-text-glow-green';
    return 'text-gray-500';
  };

  const renderNotes = () => {
    if (cell.value || cell.notes.size === 0) return null;
    
    const notes = Array.from(cell.notes).sort();
    return (
      <div className="grid grid-cols-3 gap-0 text-xs text-purple-400 leading-none">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <div key={num} className="flex items-center justify-center h-2">
            {notes.includes(num) ? <span className="cyber-text-glow-purple">{num}</span> : ''}
          </div>
        ))}
      </div>
    );
  };

  const handleCellClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to board/background
    onClick();
  };

  return (
    <button
      className={`
        relative aspect-square w-full min-h-[40px] sm:min-h-[50px] md:min-h-[60px] 
        transition-all duration-300 focus:outline-none 
        focus:ring-2 focus:ring-cyan-500 focus:ring-inset
        transform hover:scale-105 active:scale-95
        ${getBorderClasses()} 
        ${getBackgroundClasses()}
      `}
      style={{
        boxShadow: isSelected 
          ? '0 0 20px rgba(6, 182, 212, 0.8), inset 0 0 15px rgba(6, 182, 212, 0.3)'
          : isHighlighted
          ? '0 0 15px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(16, 185, 129, 0.2)'
          : cell.hasConflict
          ? '0 0 15px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(239, 68, 68, 0.3)'
          : cell.isIncorrect
          ? '0 0 12px rgba(239, 68, 68, 0.6), inset 0 0 8px rgba(239, 68, 68, 0.2)'
          : isRelated
          ? '0 0 8px rgba(147, 51, 234, 0.3), inset 0 0 8px rgba(147, 51, 234, 0.1)'
          : '0 0 5px rgba(31, 41, 55, 0.5), inset 0 0 5px rgba(31, 41, 55, 0.2)'
      }}
      onClick={handleCellClick}
      aria-label={`Cell ${row + 1}, ${col + 1}${cell.value ? `, value ${cell.value}` : ', empty'}`}
    >
      {cell.value ? (
        <span className={`text-lg sm:text-xl md:text-2xl ${getTextClasses()}`}>
          {cell.value}
        </span>
      ) : (
        renderNotes()
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-cyan-400 pointer-events-none rounded-sm animate-pulse" />
      )}
    </button>
  );
}