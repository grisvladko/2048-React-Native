
export class Tile {
  
  constructor(value,row, col) {
    this.value = value
    this.row = row
    this.col = col 
    this.prevRow = -1
    this.prevCol = -1
    this.isNew = true
    this.isMerged = false
  }

}

export class Cell {

  put = (tile) => {
    this.tile = tile
  }
}

export class Game {
  
  constructor() {
    this.board = this.setEmptyBoard()
    this.prevBoard = null
    this.currentScore = 0
    this.currentMoveScore = 0

    // UNCOMMENT FOR DUBBING THE END GAME , COMMENT PREVIOUS LINES OUT
    // this.board = this.generateEndGameTestBoard()
    this.addRandomTile()
  } 

  generateEndGameTestBoard = () => {
    let board = []

    for (let i = 0; i < 4; i++) {
      board.push([])
      for (let j = 0; j < 4; j++) {
        board[i].push(new Cell())
        if (i < 3 || j < 1) board[i][j].put(new Tile((i + 1) * (j + 1), i,j)) // have only last cell empty
        
      }
    }

    return board
  }

  setEmptyBoard = () => {
    let board = []

    for (let i = 0; i < 4; i++) {
      board.push([])
      for (let j = 0; j < 4; j++) {
        board[i].push(new Cell())
      }
    }

    return board
  }

  undo = () => {
    const prev = this.prevBoard
    this.prevBoard = null
    this.currentScore -= this.currentMoveScore
    this.currentMoveScore = 0
    return prev
  }

  copyBoard = () => {
    let res = []

    for (let i = 0; i < this.board.length; i++) {
      res.push([])
      for(let j = 0; j < this.board.length; j++) {
        res[i].push(new Cell())
        if (this.board[i][j].tile !== undefined) {
          const temp = this.board[i][j].tile
          res[i][j].tile = new Tile(temp.value, temp.row, temp.col)
          res[i][j].tile.isNew = temp.isNew
          res[i][j].tile.isMerged = temp.isMerged
          res[i][j].tile.isNew = temp.isNew
          res[i][j].tile.prevRow = temp.prevRow
          res[i][j].tile.prevCol = temp.prevCol
        } 
      }
    }

    return res
  }

  addTile = (newValue, row, col) => {
    return new Tile(newValue, row, col)
  }

  addRandomTile = () => {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!this.board[r][c].tile) {
          emptyCells.push({r: r, c: c});
        }
      }
    }

    if (emptyCells.length === 0) return

    let index = ~~(Math.random() * emptyCells.length);
    let cell = emptyCells[index];
    let newValue = Math.random() < 0.1 ? 4 : 2;
    this.board[cell.r][cell.c].put(this.addTile(newValue, cell.r, cell.c))
  }

  rotateLeft = (matrix) => {
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];

    for (var row = 0; row < rows; row++) {
      res.push([]);
      for (var column = 0; column < columns; column++) {
        res[row][column] = matrix[column][columns - row - 1];
      }
    }
    return res;
  };

  move = (direction) => {
    this.currentMoveScore = 0
    this.prevBoard = this.copyBoard()

    for (var i = 0; i < direction; i++) {
      this.board = this.rotateLeft(this.board);
    }

    const hasChanged = this.moveLeft();

    for (var i = direction; i < 4; i++) {
      this.board = this.rotateLeft(this.board);
    }

    if (hasChanged) {
      this.fixTilePlacement()
      this.addRandomTile();
      this.currentScore += this.currentMoveScore
      return this.board
    }
  }

  moveLeft = () => {
    let hasChanged = false 
    for (let row = 0; row < 4; row++) {
      let rowWithTiles = this.board[row].filter(cell => cell.tile != undefined)
      let newRow = []

      if (rowWithTiles.length === 0) continue

      let col = 0
      while(rowWithTiles.length > 0) {
        rowWithTiles[col].tile.isMerged = false

        if (col + 1 < rowWithTiles.length) {
          if (rowWithTiles[col].tile.value === rowWithTiles[col + 1].tile.value) {
            newRow.push(this.mergeCells(rowWithTiles.shift(), rowWithTiles.shift()))
          } else {
            newRow.push(rowWithTiles.shift())
          }
        } else {
          newRow.push(rowWithTiles.shift())
        }
      }

      for (let i = newRow.length; i < 4; i++) {
        newRow.push(new Cell())
      }

      for (let i = 0; i < newRow.length; i++) if (newRow[i].tile) newRow[i].tile.isNew = false 

      hasChanged = !this.isRowIdentical(this.board[row], newRow) || hasChanged
      this.board[row] = newRow
    }

    return hasChanged
  };

  isRowIdentical(lhs, rhs) {
    let cleanLhs = this.getCleanRow(lhs)
    let cleanRhs = this.getCleanRow(rhs)

    for (let i = 0; i < lhs.length; i++) {
      if (cleanLhs[i] !== cleanRhs[i]) return false
    }
    
    return true
  }


  mergeCells = (lhs, rhs) => {
    lhs.tile.isMerged = true
    lhs.tile.value += rhs.tile.value
    this.currentMoveScore += lhs.tile.value
    return lhs
  }

  fixTilePlacement = () => {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j].tile != undefined) {
          this.board[i][j].tile.prevRow = this.board[i][j].tile.row
          this.board[i][j].tile.prevCol = this.board[i][j].tile.col
          this.board[i][j].tile.row = i
          this.board[i][j].tile.col = j
        }
      }
    }
  }

  deltaX = [-1, 0, 1, 0];
  deltaY = [0, -1, 0, 1]; 

  hasLost = () => {
    var canMove = false;
    var cleanBoard = this.getCleanMatrix(this.board)

    const deltaX = [-1, 0, 1, 0];
    const deltaY = [0, -1, 0, 1];

    for (var row = 0; row < cleanBoard.length; row++) {
      for (var column = 0; column < cleanBoard.length; column++) {
        canMove |= (cleanBoard[row][column] === 0);
        for (var dir = 0; dir < 4; dir++) {
          var newRow = row + deltaX[dir];
          var newColumn = column + deltaY[dir];

          if (newRow < 0 || newRow >= cleanBoard.length || newColumn < 0 || newColumn >= cleanBoard.length) {
            continue;
          }
          canMove |= (cleanBoard[row][column] === cleanBoard[newRow][newColumn]);
        }
      }
    }

    return !canMove;
  }

  getCleanRow(row) {
    let res = []

    for (let i = 0; i < row.length; i++) {
      if (row[i].tile === undefined) res.push(0)
      else res.push(row[i].tile.value)
    }

    return res
  }

  getCleanMatrix(origin) {
    let res = []
    for (let i = 0; i < origin.length; i++) {
      res.push([])
      for (let j = 0; j < origin.length; j++) {
        if (origin[i][j].tile === undefined) res[i].push(0)
        else res[i].push(origin[i][j].tile.value)
      }
    }

    return res
  }
}
