import React, { useState, useRef, useEffect, useContext, useCallback, createContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration } from 'react-native';

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
const { View, Text, Image: ImageV, ScrollView: ScrollV } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';

import { getStatusBarHeight } from 'react-native-status-bar-height';


import { GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer, MessageImage } from 'react-native-gifted-chat'
import { Video, AVPlaybackStatus } from 'expo-av';

import Image from 'react-native-scalable-image';

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { OverlayDownloader } from "./OverlayDownloader";



import axios from "axios";
import jwtDecode from 'jwt-decode';
import { io } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Context = createContext()

const list = [
  { name: "a", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "b", description: "fewf的话就开始as", personID: Math.random(), key: Math.random() },
  { name: "c", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "d", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "e", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "f", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "g", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "h", description: "as是as", personID: Math.random(), key: Math.random() },
  { name: "i", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "j", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "k", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "l", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "m", description: "fewfas", personID: Math.random(), key: Math.random() },
  { name: "n", description: "s ewfas", personID: Math.random(), key: Math.random() },
  { name: "o", description: "fewd fas", personID: Math.random(), key: Math.random() },
  { name: "p", description: "feds wfas", personID: Math.random(), key: Math.random() },
  // { name: "q", description: "few dfas", key: Math.random() },
  // { name: "r", description: "s ewfas", key: Math.random() },
  // { name: "s", description: "fewd fas", key: Math.random() },
  // { name: "t", description: "feds wfas", key: Math.random() },
  // { name: "u", description: "few dfas", key: Math.random() },
  // { name: "v", description: "feds wfas", key: Math.random() },
  // { name: "w", description: "few dfas", key: Math.random() },
  // { name: "x", description: "s ewfas", key: Math.random() },
  // { name: "y", description: "fewd fas", key: Math.random() },
  // { name: "z", description: "feds wfas", key: Math.random() },
  // { name: "A", description: "few dfas", key: Math.random() },
  // { name: "b", description: "fewf的话就开始as", key: Math.random() },
  // { name: "c", description: "fewfas", key: Math.random() },
  // { name: "d", description: "fewfas", key: Math.random() },
  // { name: "e", description: "fewfas", key: Math.random() },
  // { name: "f", description: "fewfas", key: Math.random() },
  // { name: "g", description: "fewfas", key: Math.random() },
  // { name: "h", description: "as是as", key: Math.random() },
  // { name: "i", description: "fewfas", key: Math.random() },
  // { name: "j", description: "fewfas", key: Math.random() },
  // { name: "k", description: "fewfas", key: Math.random() },
  // { name: "l", description: "fewfas", key: Math.random() },
  // { name: "m", description: "fewfas", key: Math.random() },
  // { name: "n", description: "s ewfas", key: Math.random() },
  // { name: "o", description: "fewd fas", key: Math.random() },
  // { name: "p", description: "feds wfas", key: Math.random() },
  // { name: "q", description: "few dfas", key: Math.random() },
  // { name: "r", description: "s ewfas", key: Math.random() },
  // { name: "s", description: "fewd fas", key: Math.random() },
  // { name: "t", description: "feds wfas", key: Math.random() },
  // { name: "u", description: "few dfas", key: Math.random() },
  // { name: "v", description: "feds wfas", key: Math.random() },
  // { name: "w", description: "few dfas", key: Math.random() },
  // { name: "x", description: "s ewfas", key: Math.random() },
  // { name: "y", description: "fewd fas", key: Math.random() },
  // { name: "z", description: "feds wfas", key: Math.random() },
  // { name: "A", description: "few dfas", key: Math.random() },

]



import url from "./config";





export default function ContextProvider(props) {




  const [peopleList, setPeopleList] = useState(list)
  const [snackBarHeight, setSnackBarHeight] = useState(0)
  const [snackMsg, setSnackMsg] = useState("Hihi")

  const [token, setToken] = useState(null)
  const [userName, setUserName] = useState("")

  // let socket = io(`http://192.168.0.100`, {
  //   auth: {
  //     userName: "aas",
  //     token: "ffff"
  //   }
  // })

  useEffect(function () {

    AsyncStorage.getItem("token").then(token => {

      if (token) {

        setToken(token)
        setUserName(jwtDecode(token).userName)
  
      }
      else {
        const randomStr = String(Date.now()).slice(-3)
        axios.post(`${url}/api/user/fetchtoken`, {

          userName: "user" + randomStr,

        }).then(response => {
          const token = response.headers["x-auth-token"]

          setToken(token)
          AsyncStorage.setItem("token", token)
          setUserName(jwtDecode(token).userName)
      
          
        })
      }


    })


  }, [])



  return <Context.Provider value={{

    token,setToken,
    userName,setUserName,


    peopleList,
    setPeopleList,

    // messageList,
    // setMessageList,

    snackBarHeight,
    setSnackBarHeight,

    snackMsg,
    setSnackMsg,

  }}>
    {props.children}
  </Context.Provider>


}