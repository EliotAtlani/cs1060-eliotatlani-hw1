import React, { useEffect, useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { SolverStep } from '../types/sudoku';

interface HintDisplayProps {
  hint: SolverStep | null;
  onClose: () => void;
}

export function HintDisplay({ hint, onClose }: HintDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hint) {
      setIsVisible(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [hint, onClose]);

  if (!hint) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md 
                    bg-white rounded-lg shadow-lg border border-yellow-200 p-4 z-40
                    transition-all duration-300 ${isVisible ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-full'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1">
            {hint.technique}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {hint.description}
          </p>
          
          {hint.cells.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              Focus on: {hint.cells.map(cell => 
                `(${cell.row + 1},${cell.col + 1})`
              ).join(', ')}
            </div>
          )}
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none 
                     focus:ring-2 focus:ring-yellow-500 rounded p-1"
          aria-label="Close hint"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Progress bar for auto-hide */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-100 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-yellow-400 transition-all duration-[8000ms] ease-linear"
          style={{ width: isVisible ? '0%' : '100%' }}
        />
      </div>
    </div>
  );
}