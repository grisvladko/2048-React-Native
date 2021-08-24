import React, { useState } from "react";
import { StyleSheet, View, Dimensions, SafeAreaView } from "react-native";
import { Game } from "./game logic/Board";
import TileView from "./TileView";
import GestureRecognizer from "react-native-swipe-gestures";
import Dashboard from "./Dashboard";
import GameContext from './context/GameContext';
import EndGameOverlay from './EndGameOverlay'
import { saveBestScore, setBestScore } from "./Database"

let boardWidth = Dimensions.get("window").width;
boardWidth = (boardWidth > 700 ? 700 : boardWidth)

const BoardView = () => {
  const [game, setGame] = useState(new Game())
  const [board, setBoard] = useState(game.board)
  const [isGameOver, setIsGameOver] = useState(false) // use to show overlay !

  const swipeHandler = (direction) => {
    // 0 = left, 1 = up, 2 = right, 3 = down
    const newBoard = game.move(direction)
    if (newBoard) {
      setBoard(newBoard)
    }

    if (game.hasLost())  {
      setBestScore(game.currentScore)
      setIsGameOver(true) 
    }
  }

  const onScoreHandler = () => {
    return game.currentScore
  }

  const cells = 
  <View style={styles.board}>
    {board.map((row, rowIndex) =>
      <View key={`cell-${rowIndex}`} style={styles.row} >
        {row.map((cell, cellIndex) =>
          <View key={`cell-${cellIndex}`} 
          style={styles.cell} />
        )}
      </View>
    )}
  </View>

  const setTiles = () => {
    let res = []
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.tile) res.push(cell.tile)
      })
    })

    return res
  }

  const tiles = setTiles().map((tile, tileIndex) => 
    <TileView 
      onScoreHandler={ onScoreHandler }
      width={boardWidth / 4} 
      tile={tile} 
      key={tileIndex}/>
    )

  const dashboardStyle = {
    dashboard: {
      width: boardWidth,
      height: '20%'
    }
  }

  const onNewGameHandler = async () => {
    const g = new Game()
    setGame(g)
    setBoard(g.board)
    await setBestScore(game.currentScore)
    setIsGameOver(false)
  }

  const onUndoHandler = () => {
    const prevBoard = game.undo()
    if (prevBoard === null) return 
    else {
      game.board = prevBoard
      setBoard(prevBoard)
    }
    setIsGameOver(game.hasLost())
  }

  return (
    <GameContext.Provider value={ {game: game, onNewGameHandler: onNewGameHandler, onUndo: onUndoHandler} }>
      <SafeAreaView onLayout={() => saveBestScore(0) } style={styles.screen}>
        <Dashboard style={ dashboardStyle }/>
        <GestureRecognizer
        onSwipeLeft={ () => swipeHandler(0) }
        onSwipeRight={ () => swipeHandler(2) }
        onSwipeUp={ () => swipeHandler(1) }
        onSwipeDown={ () => swipeHandler(3) }>
          { cells }
          { tiles }
          { isGameOver && <EndGameOverlay/>}
        </GestureRecognizer>
      </SafeAreaView>
    </GameContext.Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '10%',
  },
  board: {
    width: boardWidth,
    backgroundColor: '#bbada0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: boardWidth / 4,
    height: boardWidth / 4,
    padding: 5,
    borderWidth: 5,
    backgroundColor: 'transparent',
    borderColor: '#cdc1b4'
  },
  gameOver: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(205,193,180, 0.3)'
  }
});

export default BoardView;
