
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveBestScore = async (value) => {
  try {
    await AsyncStorage.setItem('best', value.toString())
  } catch (e) {
    console.log(e)  
  }
}

export const setBestScore = async (newValue) => {
  const prevBest = (await getBestScore())

  if (prevBest === null) {
    await saveBestScore(newValue)
  } else {
    if (newValue > prevBest) await saveBestScore(newValue)
  }
}

export const getBestScore = async () => {
  try {
    const value = await AsyncStorage.getItem('best')
    if(value !== null) {
      return value
    }
  } catch(e) {
    console.log(e)
  }
  return null
}