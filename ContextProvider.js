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



import * as Notifications from 'expo-notifications';


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
  const [unreadCountObj, setUnreadCountObj] = useState({})



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

      assignListenning({ socket, token, setPeopleList, userName, appState, unreadCountObj, setUnreadCountObj })
      setSocket(socket)
    }
    if (!token && socket) {
      socket.offAny()
      //socket.disconnect()
    }

  }, [token])

  useEffect(async function () {

    const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "MessageFolder/")

    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "MessageFolder/")
    }
    else {
      return info
    }

    const info2 = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "UnreadFolder/")
    if (!info2.exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "UnreadFolder/")
    }
    else {
      return info2
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

    unreadCountObj,
    setUnreadCountObj,

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


function assignListenning({ socket, token, setPeopleList, userName, appState, unreadCountObj, setUnreadCountObj }) {

  socket.on("connect", function () {
    console.log(`socket ${socket.id + " " + userName} is connected`)
    socket.emit("helloFromClient")

    axios.get(`${url}/api/user/fecthunread`, { headers: { "x-auth-token": token } }).then(response => {

      const msgArr = response.data
      if (msgArr.length === 0) { setPeopleList(pre => [...pre]); return } //causing recount unread in homepage return }





      msgArr.forEach((msg, index) => {
        const sender = msg.sender

        const folderUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "/"
        const folderUri2 = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/"

        const fileUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "/" + sender + "---" + msg.createdTime
        const fileUri2 = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/" + sender + "---" + msg.createdTime

        FileSystem.getInfoAsync(folderUri)
          .then(info => {
            if (!info.exists) { return FileSystem.makeDirectoryAsync(folderUri) }
            else { return info }
          })
          .then(() => {
            FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
          })


        FileSystem.getInfoAsync(folderUri2)
          .then(info => {
            if (!info.exists) { return FileSystem.makeDirectoryAsync(folderUri2) }
            else { return info }
          })
          .then(() => {
            FileSystem.writeAsStringAsync(fileUri2, JSON.stringify(msg))
          })
          .then(() => {

            if (index === msgArr.length - 1) setPeopleList(pre => [...pre]) //causing recount unread in homepage



            // setUnreadCountObj(unreadCountObj => {
            //   msgArr.forEach(msg => {
            //     const sender = msg.sender
            //     if (!unreadCountObj[sender]) { unreadCountObj[sender] = 0 }
            //     unreadCountObj[sender]++
            //   })
            //   return { ...unreadCountObj }
            // })

          })


      })




    })





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

  })



  socket.on("helloFromServer", function (data) {
    console.log("hello on client", data)

  })


  socket.on("notifyUser", function (sender, msgArr) {
    if ((socket.listeners("displayMessage" + sender).length === 0) || appState.current === "background" || appState.current === "inactive") {
      Notifications.scheduleNotificationAsync({
        content: {
          title: sender,
          body: msgArr[0].image ? "[image] made by local" : msgArr[0].text + " made by local",
        },
        trigger: null// { seconds: 2 },
      });
    }
  })




  socket.on("saveUnread", function (sender, msgArr) {

    if ((socket.listeners("displayMessage" + sender).length === 0) || appState.current === "background" || appState.current === "inactive") {




      const folderUri = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/"
      msgArr.forEach((msg) => {

        //console.log(msg)

        const fileUri = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/" + sender + "---" + msg.createdTime

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
            return FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))


          })
        // .then(() => {
        //   FileSystem.readDirectoryAsync(folderUri).then(data => {
        //     console.log("---", data)
        //   })
        // })


      });




      //   console.log(unreadCountObj)
      setUnreadCountObj(unreadCountObj => {

        msgArr.forEach(msg => {
          const sender = msg.sender
          if (!unreadCountObj[sender]) { unreadCountObj[sender] = 0 }
          unreadCountObj[sender]++
        })
        return { ...unreadCountObj }

      })

    }


  })



  socket.on("disconnect", function (msg) {
    //  console.log("socket " + userName + " is disconnected")

  })








}

