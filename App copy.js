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


import { NavigationContainer } from '@react-navigation/native';
import ContextProvider from "./ContextProvider";

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
      {/* <NavigationContainer>
        <StackNavigator1 />
      </NavigationContainer> */}
    </ContextProvider>



  )


  return (
    <View style={[styles.container]}>
      <Text>Open up App.js to start wofffdrking on yourkkkk app!</Text>

      <ReAnimated.View

        onTouchEnd={function () {

          scrollY.value = Math.floor(Math.random() * 300 + 30)


        }}

        style={styleA}><Text>fdsf</Text></ReAnimated.View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
