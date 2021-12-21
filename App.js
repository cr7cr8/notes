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

import { ListItem, Avatar, LinearProgress, Button, Overlay, Input } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";

//import Image from 'react-native-scalable-image';

import Lightbox from 'react-native-lightbox';
import ViewTransformer from "react-native-easy-view-transformer";



import AsyncStorage from '@react-native-async-storage/async-storage';
import SnackBar from "./SnackBar";

import axios from "axios";
import jwtDecode from 'jwt-decode';
import { io } from "socket.io-client";
import url from "./config";

export default function App() { return (<ContextProvider><AppStarter /></ContextProvider>) }

function AppStarter() {

  const { token, setToken, initialRouter, setInitialRouter } = useContext(Context)

  useEffect(function () {

    if (!initialRouter) {


      AsyncStorage.getItem("token").then(token => {

        if (token) {
          setToken(token)
          setInitialRouter("Home")
        }
        else {
          setInitialRouter("Reg")

        }


   
      })


    }




  }, [initialRouter])

  // useEffect(function () {

  //   if (token) {


  //     socket = io(`${url}`, {
  //       auth: {
  //         userName: userName,
  //         token: token
  //       }
  //     })

  //     assignListenning({ socket, token, setPeopleList })


  //   }

  // }, [token])
  // return <><NavigationContainer><StackNavigator /></NavigationContainer><SnackBar /></>


  if (initialRouter) {
    return (
      <>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
        <SnackBar />
      </>
    )
  }

  return <></>


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
