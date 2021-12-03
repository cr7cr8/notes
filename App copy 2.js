import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// import ReAnimated, {
//   useAnimatedStyle, useSharedValue, useDerivedValue,
//   withTiming, cancelAnimation, runOnUI, useAnimatedReaction, runOnJS,
//   useAnimatedGestureHandler,
//   interpolate,
//   withDelay,
//   withSpring,
//   useAnimatedScrollHandler,
//   Extrapolate,
//   interpolateColor,
//   useAnimatedProps,
//   withSequence,
// } from 'react-native-reanimated';



import ContextProvider from "./ContextProvider";

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./StackNavigator";
import multiavatar from '@multiavatar/multiavatar';


import { HomeScreen, DetailScreen } from "./HomeScreen";






import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from 'react-native';

import ReAnimated, {
  useAnimatedStyle, useSharedValue, useDerivedValue,
  withTiming, cancelAnimation, runOnUI, useAnimatedReaction, runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  withDelay,
  withSpring,
  useAnimatedScrollHandler,
  Extrapolate,
  //interpolateColors,

  useAnimatedProps,
  withSequence,
  withDecay,

} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, ScrollView: ScrollV, Image, } = ReAnimated



//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";

//import Image from 'react-native-scalable-image';

import Lightbox from 'react-native-lightbox';
import ViewTransformer from "react-native-easy-view-transformer";












export default function App() {


  const style = useAnimatedStyle(() => {
    return {
      width,
      height,
      backgroundColor: "pink",

    }
  })


  const imageWidth = width;
  const imageHeight = height;


  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)
  const scale = useSharedValue(1)


  const frameStyle = useAnimatedStyle(() => {
    return {

      transform: [
        { translateX: focalX.value / scale.value},
        { translateY: focalY.value/ scale.value },
        { translateX: -imageWidth/ scale.value / 2, },
        { translateY: -imageHeight / scale.value/ 2, },


        { scale: scale.value },


        { translateX: -focalX.value/ scale.value },
        { translateY: -focalY.value/ scale.value },
        { translateX: imageWidth / scale.value/ 2 },
        { translateY: imageHeight / scale.value/ 2 },



      ]
    }
  })

  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, ctx) => {

      //    console.log(event)
      //    scale.value = event.scale

      // focalX.value = withTiming(event.focalX)
      // focalY.value = withTiming(event.focalY)
      focalX.value = focalX.value / scale.value
      focalY.value = focalY.value / scale.value;

      ctx.scale = scale.value
    },
    onActive: (event, ctx) => {

      console.log(event)


      focalX.value = event.focalX / scale.value;
      focalY.value = event.focalY / scale.value;
      scale.value = event.scale * ctx.scale



    },
    onEnd: (event, ctx) => {
      scale.value = scale.value

      if (scale.value < 1) {
        scale.value = withTiming(1)
      }

      focalX.value = focalX.value
      focalY.value = focalY.value


    }


  })


  return (
    <PinchGestureHandler onGestureEvent={gestureHandler} >
      <View style={style}>

        <Image resizeMode="contain" source={{ uri: "https://picsum.photos/200/300" }}
          style={[{ width: imageWidth, height: imageHeight }, frameStyle]}
        />

      </View>
    </PinchGestureHandler>
  )









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
