import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import BoardView from './components/BoardView';

export default function App() {
  return (
    <View style={styles.container}>
      <BoardView/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee"
  }
});
