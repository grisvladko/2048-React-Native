import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import GameContext from "./context/GameContext";
import { getBestScore } from "./Database"

const Dashboard = (props) => {

  const [best, setBest] = useState(0)

  useEffect(() => {
    getBestScore().then(res => {
      if (res !== null) setBest(res)
      else setBest(0)
    })
  })

  return (
    <GameContext.Consumer>
      { ( {game, onNewGameHandler, onUndo } ) => (
        <View onLayout={() => console.log() } style={[styles.dashboard, props.style.dashboard]}>
        <View style={styles.logo}><Text style={styles.logoTxt}> 2048 </Text></View>
        <View style={styles.scoreAndMore}>
          <View style={styles.col}>
            <View style={styles.scoreBoard}>
              <Text style={styles.text}> SCORE </Text>
              <Text style={styles.text}>{game.currentScore}</Text>
              </View>
            <View style={styles.btn}><Button onPress={onNewGameHandler} color='transparent' title='  NEW  '/></View>
          </View>
          <View style={styles.col}>
            <View style={styles.scoreBoard}>
              <Text style={styles.text}> BEST </Text>
              <Text style={styles.text}>{best}</Text>
            </View>
            <View style={styles.btn}><Button onPress={onUndo} color='transparent' title='  UNDO  '/></View>
          </View>
        </View>
      </View>)
      }
    </GameContext.Consumer>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    flexDirection: 'row',
    margin: 30,
    padding: 10,
  },
  logo: {
    backgroundColor: 'orange',
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  logoTxt: {
    fontWeight: 'bold',
    fontSize: 34,
    color: 'white'
  },
  scoreAndMore: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  col: {
    flex: 1,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  scoreBoard: {
    width: '70%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'black',
    padding: 5
  },
  btn: {
    backgroundColor: '#ed593b',
    borderRadius: 5,
    width: '70%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Dashboard;