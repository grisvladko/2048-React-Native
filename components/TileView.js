import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, Animated, Button } from "react-native";


const TileView = (props) => {

  const getStartPosition = () => {
    let prevRow = props.tile.prevRow
    let prevCol = props.tile.prevCol

    if (prevCol < 0 && prevRow < 0) {
      return {x: (props.tile.col * props.width), y: (props.tile.row * props.width)}
    } else return {x: (prevCol * props.width), y: (prevRow * props.width)}
  }

  const animatedPosition = new Animated.ValueXY(getStartPosition()) // row and col of props.tile
  const animatedNewTile = new Animated.Value(props.tile.isNew ? 0 : 1)
  const animatedMergedTile = new Animated.Value(props.tile.isMerged ? (props.width + 30) : props.width)

    Animated.parallel([
      Animated.timing(animatedNewTile, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false 
      }).start(),
      Animated.spring( animatedPosition, {
        toValue: {x: (props.tile.col * props.width), y: (props.tile.row * props.width)},
        useNativeDriver: false
      }).start(),
      Animated.timing(animatedMergedTile, {
        toValue: props.width,
        duration: 200,
        useNativeDriver: false 
      }).start()
    ])
  
    const animatedStyles = {opacity: animatedNewTile, width: animatedMergedTile, height: animatedMergedTile}

  return (
    <Animated.View style={[animatedStyles, styles.tile, animatedPosition.getLayout()]}>
      <View style={ [styles.contentView, styles[`tile${props.tile.value}`]] }><Text style={styles.textStyle}> { props.tile.value } </Text></View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({ 
  tile: {
    position: 'absolute',
    padding: 5
  },
  contentView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 5
  },
  tile2: {
    backgroundColor: "orange"
  },
  tile4: {
    backgroundColor: "rgb(39, 207, 207)"
  },
  tile8: {
    backgroundColor: "pink"
  },
  tile16: {
    backgroundColor: "gold"
  },
  tile32: {
    backgroundColor: "greenyellow"
  },
  tile64: {
    backgroundColor: "#e9c46a"
  },
  tile128: {
    backgroundColor: "goldenrod"
  },
  tile256: {
    backgroundColor: "rebeccapurple"
  },
  tile512: {
    backgroundColor: "cyan"
  },
  tile1024: {
    backgroundColor: "gold"
  },
  tile2048: {
    backgroundColor: "aquamarine"
  },
  textStyle: {
    fontSize: 30,
    fontWeight: "bold",
    color: 'white'
  }
})

export default TileView;