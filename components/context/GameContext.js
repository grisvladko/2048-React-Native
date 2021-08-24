import React, { Context } from 'react'
import { Game } from "../game logic/Board";

const GameContext = React.createContext(new Game())

export default GameContext