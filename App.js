import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ReAnimated, {
  useAnimatedStyle, useSharedValue, useDerivedValue,
  withTiming, cancelAnimation, runOnUI, useAnimatedReaction, runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  withDelay,
  withSpring,
  useAnimatedScrollHandler,
  Extrapolate,
  interpolateColor,
  useAnimatedProps,
  withSequence,
} from 'react-native-reanimated';



import ContextProvider from "./ContextProvider";

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./StackNavigator";
import multiavatar from '@multiavatar/multiavatar';


import { HomeScreen, DetailScreen } from "./HomeScreen";


export default function App() {

  const scrollY = useSharedValue(300)

  const styleA = useAnimatedStyle(() => {
    return {
      width: withTiming(scrollY.value),
      height: 300,
      backgroundColor: "pink"
    }
  })


  return (
    <ContextProvider>
      <NavigationContainer>
          <StackNavigator />
      </NavigationContainer>
    </ContextProvider>


  )



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
