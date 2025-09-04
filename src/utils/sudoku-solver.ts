import { Board, Position, SolverStep, SolverResult } from '../types/sudoku';
import { 
  BOARD_SIZE, 
  BOX_SIZE, 
  cloneBoard, 
  getPossibleValues, 
  getEmptyCells,
  getRowCells,
  getColumnCells,
  getBoxCells,
  getCellBox,
  isValidNumber
} from './sudoku-core';

export class SudokuSolver {
  private board: Board;
  private steps: SolverStep[] = [];
  private candidates: Set<number>[][] = [];

  constructor(board: Board) {
    this.board = cloneBoard(board);
    this.initializeCandidates();
  }

  private initializeCandidates(): void {
    this.candidates = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => new Set<number>())
    );

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.board[row][col] === null) {
          const possible = getPossibleValues(this.board, row, col);
          this.candidates[row][col] = new Set(possible);
        }
      }
    }
  }

  solve(): SolverResult {
    this.steps = [];
    
    let progress = true;
    while (progress && !this.isComplete()) {
      progress = false;
      
      // Try logical techniques in order of difficulty
      progress = this.applySingleCandidate() || progress;
      progress = this.applyHiddenSingle() || progress;
      progress = this.applyNakedPairs() || progress;
      progress = this.applyNakedTriples() || progress;
      progress = this.applyPointingPairs() || progress;
      progress = this.applyBoxLineReduction() || progress;
      progress = this.applyXWing() || progress;
      
      if (!progress) {
        // Fall back to backtracking with depth limit
        progress = this.applyBacktracking(3);
      }
    }

    return {
      solved: this.isComplete(),
      steps: this.steps,
      board: cloneBoard(this.board)
    };
  }

  private isComplete(): boolean {
    return getEmptyCells(this.board).length === 0;
  }

  private applySingleCandidate(): boolean {
    let found = false;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.board[row][col] === null && this.candidates[row][col].size === 1) {
          const value = Array.from(this.candidates[row][col])[0];
          this.placeValue(row, col, value, 'Single Candidate', 
            `Cell (${row + 1},${col + 1}) can only be ${value}`);
          found = true;
        }
      }
    }
    
    return found;
  }

  private applyHiddenSingle(): boolean {
    let found = false;
    
    // Check rows
    for (let row = 0; row < BOARD_SIZE; row++) {
      found = this.findHiddenSinglesInUnit(getRowCells(row), 'row') || found;
    }
    
    // Check columns
    for (let col = 0; col < BOARD_SIZE; col++) {
      found = this.findHiddenSinglesInUnit(getColumnCells(col), 'column') || found;
    }
    
    // Check boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        found = this.findHiddenSinglesInUnit(getBoxCells(boxRow, boxCol), 'box') || found;
      }
    }
    
    return found;
  }

  private findHiddenSinglesInUnit(cells: Position[], unitType: string): boolean {
    let found = false;
    
    for (let value = 1; value <= 9; value++) {
      const possibleCells = cells.filter(pos => 
        this.board[pos.row][pos.col] === null && 
        this.candidates[pos.row][pos.col].has(value)
      );
      
      if (possibleCells.length === 1) {
        const pos = possibleCells[0];
        this.placeValue(pos.row, pos.col, value, 'Hidden Single',
          `${value} can only go in cell (${pos.row + 1},${pos.col + 1}) in this ${unitType}`);
        found = true;
      }
    }
    
    return found;
  }

  private applyNakedPairs(): boolean {
    let found = false;
    
    // Check rows
    for (let row = 0; row < BOARD_SIZE; row++) {
      found = this.findNakedPairsInUnit(getRowCells(row), 'row') || found;
    }
    
    // Check columns
    for (let col = 0; col < BOARD_SIZE; col++) {
      found = this.findNakedPairsInUnit(getColumnCells(col), 'column') || found;
    }
    
    // Check boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        found = this.findNakedPairsInUnit(getBoxCells(boxRow, boxCol), 'box') || found;
      }
    }
    
    return found;
  }

  private findNakedPairsInUnit(cells: Position[], unitType: string): boolean {
    let found = false;
    const emptyCells = cells.filter(pos => this.board[pos.row][pos.col] === null);
    
    for (let i = 0; i < emptyCells.length - 1; i++) {
      for (let j = i + 1; j < emptyCells.length; j++) {
        const cell1 = emptyCells[i];
        const cell2 = emptyCells[j];
        const candidates1 = this.candidates[cell1.row][cell1.col];
        const candidates2 = this.candidates[cell2.row][cell2.col];
        
        if (candidates1.size === 2 && candidates2.size === 2 && 
            this.areSetsEqual(candidates1, candidates2)) {
          
          const pairValues = Array.from(candidates1);
          const eliminatedNotes: { position: Position; values: number[] }[] = [];
          
          for (const otherCell of emptyCells) {
            if (otherCell !== cell1 && otherCell !== cell2) {
              const eliminated: number[] = [];
              for (const value of pairValues) {
                if (this.candidates[otherCell.row][otherCell.col].has(value)) {
                  this.candidates[otherCell.row][otherCell.col].delete(value);
                  eliminated.push(value);
                  found = true;
                }
              }
              if (eliminated.length > 0) {
                eliminatedNotes.push({ position: otherCell, values: eliminated });
              }
            }
          }
          
          if (found) {
            this.steps.push({
              technique: 'Naked Pair',
              description: `Naked pair ${pairValues.join(',')} in cells (${cell1.row + 1},${cell1.col + 1}) and (${cell2.row + 1},${cell2.col + 1}) eliminates candidates in ${unitType}`,
              cells: [cell1, cell2],
              values: pairValues,
              eliminatedNotes
            });
          }
        }
      }
    }
    
    return found;
  }

  private applyNakedTriples(): boolean {
    let found = false;
    
    // Similar to naked pairs but for triples
    for (let row = 0; row < BOARD_SIZE; row++) {
      found = this.findNakedTriplesInUnit(getRowCells(row), 'row') || found;
    }
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      found = this.findNakedTriplesInUnit(getColumnCells(col), 'column') || found;
    }
    
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        found = this.findNakedTriplesInUnit(getBoxCells(boxRow, boxCol), 'box') || found;
      }
    }
    
    return found;
  }

  private findNakedTriplesInUnit(cells: Position[], unitType: string): boolean {
    let found = false;
    const emptyCells = cells.filter(pos => this.board[pos.row][pos.col] === null);
    
    for (let i = 0; i < emptyCells.length - 2; i++) {
      for (let j = i + 1; j < emptyCells.length - 1; j++) {
        for (let k = j + 1; k < emptyCells.length; k++) {
          const cell1 = emptyCells[i];
          const cell2 = emptyCells[j];
          const cell3 = emptyCells[k];
          
          const union = new Set([
            ...this.candidates[cell1.row][cell1.col],
            ...this.candidates[cell2.row][cell2.col],
            ...this.candidates[cell3.row][cell3.col]
          ]);
          
          if (union.size === 3) {
            const tripleValues = Array.from(union);
            const eliminatedNotes: { position: Position; values: number[] }[] = [];
            
            for (const otherCell of emptyCells) {
              if (otherCell !== cell1 && otherCell !== cell2 && otherCell !== cell3) {
                const eliminated: number[] = [];
                for (const value of tripleValues) {
                  if (this.candidates[otherCell.row][otherCell.col].has(value)) {
                    this.candidates[otherCell.row][otherCell.col].delete(value);
                    eliminated.push(value);
                    found = true;
                  }
                }
                if (eliminated.length > 0) {
                  eliminatedNotes.push({ position: otherCell, values: eliminated });
                }
              }
            }
            
            if (found) {
              this.steps.push({
                technique: 'Naked Triple',
                description: `Naked triple ${tripleValues.join(',')} eliminates candidates in ${unitType}`,
                cells: [cell1, cell2, cell3],
                values: tripleValues,
                eliminatedNotes
              });
            }
          }
        }
      }
    }
    
    return found;
  }

  private applyPointingPairs(): boolean {
    let found = false;
    
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        for (let value = 1; value <= 9; value++) {
          found = this.findPointingPairsInBox(boxRow, boxCol, value) || found;
        }
      }
    }
    
    return found;
  }

  private findPointingPairsInBox(boxRow: number, boxCol: number, value: number): boolean {
    const boxCells = getBoxCells(boxRow, boxCol);
    const candidateCells = boxCells.filter(pos => 
      this.board[pos.row][pos.col] === null &&
      this.candidates[pos.row][pos.col].has(value)
    );
    
    if (candidateCells.length < 2 || candidateCells.length > 3) return false;
    
    // Check if all candidates are in the same row
    const uniqueRows = new Set(candidateCells.map(pos => pos.row));
    if (uniqueRows.size === 1) {
      const row = candidateCells[0].row;
      let eliminated = false;
      const eliminatedNotes: { position: Position; values: number[] }[] = [];
      
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (Math.floor(col / BOX_SIZE) !== boxCol && 
            this.board[row][col] === null &&
            this.candidates[row][col].has(value)) {
          this.candidates[row][col].delete(value);
          eliminatedNotes.push({ position: { row, col }, values: [value] });
          eliminated = true;
        }
      }
      
      if (eliminated) {
        this.steps.push({
          technique: 'Pointing Pair',
          description: `${value} in box (${boxRow + 1},${boxCol + 1}) must be in row ${row + 1}, eliminating candidates elsewhere`,
          cells: candidateCells,
          values: [value],
          eliminatedNotes
        });
      }
      
      return eliminated;
    }
    
    // Check if all candidates are in the same column
    const uniqueCols = new Set(candidateCells.map(pos => pos.col));
    if (uniqueCols.size === 1) {
      const col = candidateCells[0].col;
      let eliminated = false;
      const eliminatedNotes: { position: Position; values: number[] }[] = [];
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (Math.floor(row / BOX_SIZE) !== boxRow && 
            this.board[row][col] === null &&
            this.candidates[row][col].has(value)) {
          this.candidates[row][col].delete(value);
          eliminatedNotes.push({ position: { row, col }, values: [value] });
          eliminated = true;
        }
      }
      
      if (eliminated) {
        this.steps.push({
          technique: 'Pointing Pair',
          description: `${value} in box (${boxRow + 1},${boxCol + 1}) must be in column ${col + 1}, eliminating candidates elsewhere`,
          cells: candidateCells,
          values: [value],
          eliminatedNotes
        });
      }
      
      return eliminated;
    }
    
    return false;
  }

  private applyBoxLineReduction(): boolean {
    let found = false;
    
    for (let value = 1; value <= 9; value++) {
      // Check rows
      for (let row = 0; row < BOARD_SIZE; row++) {
        found = this.findBoxLineReductionInRow(row, value) || found;
      }
      
      // Check columns
      for (let col = 0; col < BOARD_SIZE; col++) {
        found = this.findBoxLineReductionInCol(col, value) || found;
      }
    }
    
    return found;
  }

  private findBoxLineReductionInRow(row: number, value: number): boolean {
    const candidateCells = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (this.board[row][col] === null && this.candidates[row][col].has(value)) {
        candidateCells.push({ row, col });
      }
    }
    
    if (candidateCells.length < 2) return false;
    
    const uniqueBoxes = new Set(candidateCells.map(pos => Math.floor(pos.col / BOX_SIZE)));
    if (uniqueBoxes.size === 1) {
      const boxCol = candidateCells[0].col - (candidateCells[0].col % BOX_SIZE);
      const boxRow = row - (row % BOX_SIZE);
      let eliminated = false;
      const eliminatedNotes: { position: Position; values: number[] }[] = [];
      
      for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
        for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
          if (r !== row && this.board[r][c] === null && this.candidates[r][c].has(value)) {
            this.candidates[r][c].delete(value);
            eliminatedNotes.push({ position: { row: r, col: c }, values: [value] });
            eliminated = true;
          }
        }
      }
      
      if (eliminated) {
        this.steps.push({
          technique: 'Box-Line Reduction',
          description: `${value} in row ${row + 1} is confined to one box, eliminating candidates elsewhere in the box`,
          cells: candidateCells,
          values: [value],
          eliminatedNotes
        });
      }
      
      return eliminated;
    }
    
    return false;
  }

  private findBoxLineReductionInCol(col: number, value: number): boolean {
    const candidateCells = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (this.board[row][col] === null && this.candidates[row][col].has(value)) {
        candidateCells.push({ row, col });
      }
    }
    
    if (candidateCells.length < 2) return false;
    
    const uniqueBoxes = new Set(candidateCells.map(pos => Math.floor(pos.row / BOX_SIZE)));
    if (uniqueBoxes.size === 1) {
      const boxRow = candidateCells[0].row - (candidateCells[0].row % BOX_SIZE);
      const boxCol = col - (col % BOX_SIZE);
      let eliminated = false;
      const eliminatedNotes: { position: Position; values: number[] }[] = [];
      
      for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
        for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
          if (c !== col && this.board[r][c] === null && this.candidates[r][c].has(value)) {
            this.candidates[r][c].delete(value);
            eliminatedNotes.push({ position: { row: r, col: c }, values: [value] });
            eliminated = true;
          }
        }
      }
      
      if (eliminated) {
        this.steps.push({
          technique: 'Box-Line Reduction',
          description: `${value} in column ${col + 1} is confined to one box, eliminating candidates elsewhere in the box`,
          cells: candidateCells,
          values: [value],
          eliminatedNotes
        });
      }
      
      return eliminated;
    }
    
    return false;
  }

  private applyXWing(): boolean {
    let found = false;
    
    for (let value = 1; value <= 9; value++) {
      found = this.findXWingInRows(value) || found;
      found = this.findXWingInCols(value) || found;
    }
    
    return found;
  }

  private findXWingInRows(value: number): boolean {
    const rowsWithTwo: number[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      const candidateCols = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.board[row][col] === null && this.candidates[row][col].has(value)) {
          candidateCols.push(col);
        }
      }
      if (candidateCols.length === 2) {
        rowsWithTwo.push(row);
      }
    }
    
    for (let i = 0; i < rowsWithTwo.length - 1; i++) {
      for (let j = i + 1; j < rowsWithTwo.length; j++) {
        const row1 = rowsWithTwo[i];
        const row2 = rowsWithTwo[j];
        
        const cols1 = [];
        const cols2 = [];
        
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (this.board[row1][col] === null && this.candidates[row1][col].has(value)) {
            cols1.push(col);
          }
          if (this.board[row2][col] === null && this.candidates[row2][col].has(value)) {
            cols2.push(col);
          }
        }
        
        if (cols1.length === 2 && cols2.length === 2 && 
            cols1[0] === cols2[0] && cols1[1] === cols2[1]) {
          
          let eliminated = false;
          const eliminatedNotes: { position: Position; values: number[] }[] = [];
          
          for (const col of cols1) {
            for (let row = 0; row < BOARD_SIZE; row++) {
              if (row !== row1 && row !== row2 && 
                  this.board[row][col] === null && 
                  this.candidates[row][col].has(value)) {
                this.candidates[row][col].delete(value);
                eliminatedNotes.push({ position: { row, col }, values: [value] });
                eliminated = true;
              }
            }
          }
          
          if (eliminated) {
            this.steps.push({
              technique: 'X-Wing',
              description: `X-Wing pattern for ${value} in rows ${row1 + 1} and ${row2 + 1}, columns ${cols1[0] + 1} and ${cols1[1] + 1}`,
              cells: [
                { row: row1, col: cols1[0] }, { row: row1, col: cols1[1] },
                { row: row2, col: cols2[0] }, { row: row2, col: cols2[1] }
              ],
              values: [value],
              eliminatedNotes
            });
          }
          
          return eliminated;
        }
      }
    }
    
    return false;
  }

  private findXWingInCols(value: number): boolean {
    const colsWithTwo: number[] = [];
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      const candidateRows = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (this.board[row][col] === null && this.candidates[row][col].has(value)) {
          candidateRows.push(row);
        }
      }
      if (candidateRows.length === 2) {
        colsWithTwo.push(col);
      }
    }
    
    for (let i = 0; i < colsWithTwo.length - 1; i++) {
      for (let j = i + 1; j < colsWithTwo.length; j++) {
        const col1 = colsWithTwo[i];
        const col2 = colsWithTwo[j];
        
        const rows1 = [];
        const rows2 = [];
        
        for (let row = 0; row < BOARD_SIZE; row++) {
          if (this.board[row][col1] === null && this.candidates[row][col1].has(value)) {
            rows1.push(row);
          }
          if (this.board[row][col2] === null && this.candidates[row][col2].has(value)) {
            rows2.push(row);
          }
        }
        
        if (rows1.length === 2 && rows2.length === 2 && 
            rows1[0] === rows2[0] && rows1[1] === rows2[1]) {
          
          let eliminated = false;
          const eliminatedNotes: { position: Position; values: number[] }[] = [];
          
          for (const row of rows1) {
            for (let col = 0; col < BOARD_SIZE; col++) {
              if (col !== col1 && col !== col2 && 
                  this.board[row][col] === null && 
                  this.candidates[row][col].has(value)) {
                this.candidates[row][col].delete(value);
                eliminatedNotes.push({ position: { row, col }, values: [value] });
                eliminated = true;
              }
            }
          }
          
          if (eliminated) {
            this.steps.push({
              technique: 'X-Wing',
              description: `X-Wing pattern for ${value} in columns ${col1 + 1} and ${col2 + 1}, rows ${rows1[0] + 1} and ${rows1[1] + 1}`,
              cells: [
                { row: rows1[0], col: col1 }, { row: rows1[0], col: col2 },
                { row: rows1[1], col: col1 }, { row: rows1[1], col: col2 }
              ],
              values: [value],
              eliminatedNotes
            });
          }
          
          return eliminated;
        }
      }
    }
    
    return false;
  }

  private applyBacktracking(maxDepth: number, depth: number = 0): boolean {
    if (depth >= maxDepth) return false;
    
    const emptyCells = getEmptyCells(this.board);
    if (emptyCells.length === 0) return true;
    
    // Find cell with fewest candidates
    let bestCell = emptyCells[0];
    let minCandidates = this.candidates[bestCell.row][bestCell.col].size;
    
    for (const cell of emptyCells) {
      const candidateCount = this.candidates[cell.row][cell.col].size;
      if (candidateCount < minCandidates) {
        minCandidates = candidateCount;
        bestCell = cell;
      }
    }
    
    const candidateValues = Array.from(this.candidates[bestCell.row][bestCell.col]);
    
    for (const value of candidateValues) {
      if (isValidNumber(this.board, bestCell.row, bestCell.col, value)) {
        const oldBoard = cloneBoard(this.board);
        const oldCandidates = this.cloneCandidates();
        
        this.placeValue(bestCell.row, bestCell.col, value, 'Backtracking',
          `Trying ${value} in cell (${bestCell.row + 1},${bestCell.col + 1})`);
        
        if (this.applyBacktracking(maxDepth, depth + 1)) {
          return true;
        }
        
        // Backtrack
        this.board = oldBoard;
        this.candidates = oldCandidates;
      }
    }
    
    return false;
  }

  private placeValue(row: number, col: number, value: number, technique: string, description: string): void {
    this.board[row][col] = value;
    this.candidates[row][col].clear();
    
    this.steps.push({
      technique,
      description,
      cells: [{ row, col }],
      values: [value]
    });
    
    // Update candidates
    this.updateCandidatesAfterPlacement(row, col, value);
  }

  private updateCandidatesAfterPlacement(row: number, col: number, value: number): void {
    // Remove from row
    for (let c = 0; c < BOARD_SIZE; c++) {
      this.candidates[row][c].delete(value);
    }
    
    // Remove from column
    for (let r = 0; r < BOARD_SIZE; r++) {
      this.candidates[r][col].delete(value);
    }
    
    // Remove from box
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    
    for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
        this.candidates[r][c].delete(value);
      }
    }
  }

  private cloneCandidates(): Set<number>[][] {
    return this.candidates.map(row => 
      row.map(cell => new Set(cell))
    );
  }

  private areSetsEqual(set1: Set<number>, set2: Set<number>): boolean {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  }
}