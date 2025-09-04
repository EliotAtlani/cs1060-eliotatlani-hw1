import React from 'react';
import { Eraser } from 'lucide-react';

interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  onErase: () => void;
  isNotesMode: boolean;
}

export function NumberPad({ onNumberSelect, onErase, isNotesMode }: NumberPadProps) {
  return (
    <div className="grid grid-cols-5 gap-3 max-w-sm mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          onClick={() => onNumberSelect(num)}
          className={`aspect-square w-full min-h-[50px] rounded-lg font-bold text-lg 
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500
                     transform hover:scale-105 active:scale-95 ${
            isNotesMode
              ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-purple-200 border-2 border-purple-500 hover:from-purple-600 hover:to-purple-700 cyber-number-notes'
              : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600 cyber-number'
          }`}
          style={{
            boxShadow: isNotesMode
              ? '0 0 15px rgba(147, 51, 234, 0.4), inset 0 0 15px rgba(147, 51, 234, 0.1)'
              : '0 0 15px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.1)'
          }}
          aria-label={`Enter number ${num}${isNotesMode ? ' as note' : ''}`}
        >
          <span className={isNotesMode ? 'cyber-text-glow-purple' : 'cyber-text-glow-cyan'}>
            {num}
          </span>
        </button>
      ))}
      
      <button
        onClick={onErase}
        className="aspect-square w-full min-h-[50px] bg-gradient-to-br from-red-600 to-red-700 
                   text-white rounded-lg hover:from-red-500 hover:to-red-600 
                   transition-all duration-300 focus:outline-none focus:ring-2 
                   focus:ring-red-500 flex items-center justify-center
                   transform hover:scale-105 active:scale-95 cyber-erase"
        style={{
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.1)'
        }}
        aria-label="Erase cell"
      >
        <Eraser size={20} className="cyber-text-glow-red" />
      </button>
    </div>
  );
}