import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

const EndGameOverlay = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Game Over, try again ! </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, .5)',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  text: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'crimson',
    textAlign: 'center'
  }
})

export default EndGameOverlay