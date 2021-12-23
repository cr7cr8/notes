import React, { useState, useRef, useEffect, useContext, useCallback, createContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';
import Constants from 'expo-constants';

import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, AppState } from 'react-native';

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




import axios from "axios";
import jwtDecode from 'jwt-decode';
import { io } from "socket.io-client";




export const Context = createContext()

const list = [
  // { name: "a", description: "fewfas", personID: Math.random(), key: Math.random() },
]



import url from "./config";

const { compareAsc, format, formatDistanceToNow, } = require("date-fns");
const { zhCN } = require('date-fns/locale');


//let socket = null;
export default function ContextProvider(props) {


  const [peopleList, setPeopleList] = useState(list)
  const [snackBarHeight, setSnackBarHeight] = useState(0)
  const [snackMsg, setSnackMsg] = useState("Hihi")

  const [token, setToken] = useState(false)
  const [notiToken, setNotiToken] = useState(false)

  const userName = token ? jwtDecode(token).userName : ""

  const [displayName, setDisplayName] = useState("")

  const [socket, setSocket] = useState(null)

  const [initialRouter, setInitialRouter] = useState("")

  const appState = useRef(AppState.currentState);
  //const result = SyncStorage.get('token');






  useEffect(function () {

    if (token) {

      const socket = io(`${url}`, {
        auth: {
          userName: userName,
          token: token
        }
      })

      assignListenning({ socket, token, setPeopleList, userName })
      setSocket(socket)

    }
    if (!token && socket) {

      //socket.disconnect()
    }



  }, [token])

  useEffect(async function () {

    const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "MessageFolder/")
    //  console.log(userName, info)

    if (!info.exists) {
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "MessageFolder/")
    }

    //FileSystem.deleteAsync(FileSystem.documentDirectory + "MessageFolder/", { idempotent: true })


  }, [])


  return <Context.Provider value={{

    url,
    socket, setSocket,
    appState,

    token, setToken,
    notiToken, setNotiToken,
    userName,

    peopleList,
    setPeopleList,

    // messageList,
    // setMessageList,

    snackBarHeight,
    setSnackBarHeight,

    snackMsg,
    setSnackMsg,

    initialRouter,
    setInitialRouter,

  }}>
    {props.children}
  </Context.Provider>


}


function assignListenning({ socket, token, setPeopleList, userName }) {

  socket.on("connect", function () {
    console.log(`socket ${socket.id + " " + userName} is connected`)
  })

  socket.on("updateList", function (msg) {

    axios.get(`${url}/api/user/fetchuserlist`, { headers: { "x-auth-token": token } }).then(response => {
      setPeopleList(pre => { return response.data })
    })
  })

  socket.on("writeMessage", function (sender, msgArr) {

    // const { sender, createdTime } = { ...msg[0] }

    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "/"

    msgArr.forEach(msg => {

      //console.log(msg.createdTime,"\n",Date.now())
      const fileUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "/" + sender + "---" + msg.createdTime


      FileSystem.getInfoAsync(folderUri)
        .then(info => {
          if (!info.exists) {
            return FileSystem.makeDirectoryAsync(folderUri)

          }
          else {
            return info
          }
        })
        .then(() => {
          FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
        })

    });




    // const content = await FileSystem.readAsStringAsync(fileUri)
    // console.log(content)

    //console.log(sender, createdTime)

    // const fileUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "---" + createdTime


    // await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg[0]))
    // const content = await FileSystem.readAsStringAsync(fileUri)
    // console.log(content)




  })

  socket.on("helloFromServer", function (data) {
    console.log("hello on client", data)
  })




  socket.on("disconnect", function (msg) {
    //  console.log("socket " + userName + " is disconnected")

  })
}

