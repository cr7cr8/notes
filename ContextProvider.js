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
import { Video, AVPlaybackStatus, Audio } from 'expo-av';

import Image from 'react-native-scalable-image';

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';


import * as Notifications from 'expo-notifications';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import jwtDecode from 'jwt-decode';
import { io } from "socket.io-client";

import { Camera } from 'expo-camera';


export const Context = createContext()

const list = [
  // { name: "a", description: "fewfas", personID: Math.random(), key: Math.random() },
]



import url, { createFolder } from "./config";


const { compareAsc, format, formatDistanceToNow, } = require("date-fns");
const { zhCN } = require('date-fns/locale');


//let socket = null;
export default function ContextProvider(props) {


  const [peopleList, setPeopleList] = useState(list)
  const [latestMsgObj, setLatestMsgObj] = useState({})

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

  const chattingUser = useRef("")
  const latestChattingMsg = useRef("")



  useEffect(function () {

    if (token) {

      const socket = io(`${url}`, {
        auth: {
          userName: userName,
          token: token
        }
      })

      assignListenning({ socket, token, setPeopleList, userName, appState, unreadCountObj, setUnreadCountObj, latestMsgObj, setLatestMsgObj, setNotiToken })
      setSocket(socket)
    }
    if (!token && socket) {
      socket.offAny()
      //socket.disconnect()
    }

  }, [token])

  useEffect(function () {
    axios.get(`${url}/api/user/fetchuserlist2`, { headers: { "x-auth-token": token } })
      .then(response => {


        FileSystem.getInfoAsync(FileSystem.documentDirectory + "ImagePicker/")
          .then(({ exists }) => {
            if (!exists) {
              return FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "ImagePicker/", { intermediates: true })
            }
          })
          .catch(err => console.log("ContextProvider.js ==>>", err))


        response.data.forEach(name => {
          createFolder(name)
        })



      })

  }, [])

  useEffect(function () {
    if (userName) { createFolder(userName) }
  }, [userName])

  useEffect(function () {

    Audio.requestPermissionsAsync()
    MediaLibrary.requestPermissionsAsync()
    Notifications.requestPermissionsAsync()
    Notifications.getPermissionsAsync()
    Camera.requestCameraPermissionsAsync();
  }, [])









  return <Context.Provider value={{

    url,
    socket, setSocket,
    appState,
    chattingUser,
    latestChattingMsg,

    token, setToken,
    notiToken, setNotiToken,
    userName,

    peopleList,
    setPeopleList,

    latestMsgObj,
    setLatestMsgObj,

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


function assignListenning({ socket, token, setPeopleList, userName, appState, unreadCountObj, setUnreadCountObj, latestMsgObj, setLatestMsgObj, setNotiToken }) {

  socket.on("connect", function () {

    console.log(`${Constants.deviceName} ${userName} socket ${socket.id} is connected`)

    AsyncStorage.getItem("notiToken").then(notiToken => {

      registerForPushNotificationsAsync().then(newNotiToken => {

        //console.log("reconnect notitoken is:", newNotiToken)
        if ((typeof newNotiToken === "string") && (newNotiToken !== "[Error: Fetching the token failed: SERVICE_NOT_AVAILABLE]") && (notiToken !== newNotiToken)) {

          //console.log("register notitoken is:", notiToken)
          setNotiToken(newNotiToken)
          AsyncStorage.setItem("notiToken", newNotiToken)
        }
        else if ((typeof newNotiToken === "string") && (newNotiToken === notiToken)) {
          console.log(Constants.deviceName, "reconnect notitoken same")
          // console.log("notiToken not avaliable")
        }
        else if (typeof newNotiToken !== "string") {
          console.log(Constants.deviceName, "reconnect notitoken fail")
        }

      })
        .catch(err => {
          console.log(Constants.deviceName, "error in context.js get notitoken", err)
        })


    })




    axios.get(`${url}/api/user/fecthunread`, { headers: { "x-auth-token": token } }).then(response => {

      const obj = {}
      response.data.forEach(people => {
        obj[people] = null
      })
      setLatestMsgObj(pre => { return { ...obj, ...pre } })



      const msgArr = response.data
      if (msgArr.length === 0) { setPeopleList(pre => [...pre]); return } //causing recount unread in homepage return }





      msgArr.forEach((msg, index) => {
        let sender = msg.toPerson === "AllUser" ? "AllUser" : msg.sender

        // const folderUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "/"
        // const folderUri2 = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/"

        const fileUri = FileSystem.documentDirectory + "MessageFolder/" + sender + "/" + sender + "---" + msg.createdTime
        const fileUri2 = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/" + sender + "---" + msg.createdTime

        // FileSystem.getInfoAsync(folderUri)
        //   .then(info => {
        //     if (!info.exists) { return FileSystem.makeDirectoryAsync(folderUri).catch(err => { console.log(">>>", err) }) }
        //     else { return info }
        //   })
        //   .then(() => {
        //     FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
        //   })
        if (msg.toPerson === "AllUser") {
          FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg)).then(() => {


            setLatestMsgObj(pre => {
              let objText = ""

              if (msg.audio) {
                objText = msg.sender + ": [audio]"
              }
              else if (msg.image) {
                objText = msg.sender + ": [image]"
              }
              else if (msg.text) {
                objText = msg.sender + ": " + msg.text
              }
              return { ...pre, "AllUser": { content: objText, saidTime: msg.createdAt } }
            })

            if (index === msgArr.length - 1) setPeopleList(pre => [...pre]) //causing recount unread in homepage

          })


        }




        else if (msg.toPerson !== "AllUser") {
          FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
            .then(() => {
              FileSystem.writeAsStringAsync(fileUri2, JSON.stringify(msg))

                .then(() => {


                  setLatestMsgObj(pre => {
                    let objText = ""

                    if (msg.audio) {
                      objText = "[audio]"
                    }
                    else if (msg.image) {
                      objText = "[image]"
                    }
                    else if (msg.text) {
                      objText = msg.text
                    }
                    return { ...pre, [sender]: { content: objText, saidTime: msg.createdAt } }
                  })

                  if (index === msgArr.length - 1) setPeopleList(pre => [...pre]) //causing recount unread in homepage

                })
            })
        }
      })


    })
  })


  socket.on("updateList", function (msg) {

    axios.get(`${url}/api/user/fetchuserlist`, { headers: { "x-auth-token": token } }).then(response => {

      const promiseArr = []

      response.data.forEach(item => {
        promiseArr.push(createFolder(item.name))
      })

      Promise.all(promiseArr)
        .then(function () {

          setPeopleList(pre => { return response.data })

          const obj = {}
          response.data.forEach(people => {
            obj[people] = null
          })

          setLatestMsgObj(pre => { return { ...obj, ...pre } })

        })


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
            return FileSystem.makeDirectoryAsync(folderUri).catch(err => { console.log(">>", err) })
          }
          else {
            return info
          }
        })
        .then(() => {
          return FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
        })
        .then(() => {


          if (socket.listeners("displayMessage" + sender).length === 0) {
            setLatestMsgObj(pre => {



              let objText = ""

              if (msg.audio) {
                objText = "[audio]"
              }
              else if (msg.image) {
                objText = "[image]"
              }
              else if (msg.text) {
                objText = msg.text
              }

              return { ...pre, [msg.sender]: { content: objText, saidTime: msg.createdAt } }
            })
          }



        })
    });

  })

  socket.on("notifyUser", function (sender, msgArr) {
    if ((socket.listeners("displayMessage" + sender).length === 0) || appState.current === "background" || appState.current === "inactive") {
      Notifications.scheduleNotificationAsync({
        identifier: "default1",
        content: {
          title: sender,
          body: msgArr[0].image
            ? "[image] made by local"
            : msgArr[0].audio
              ? "[audio] made by local"
              : msgArr[0].text + " made by local",
        },
        trigger: null// { seconds: 2 },
      });
    }
  })

  socket.on("saveUnread", function (sender, msgArr) {




    if ((socket.listeners("displayMessage" + sender).length === 0) || appState.current === "background" || appState.current === "inactive") {




      const folderUri = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/"
      msgArr.forEach((msg) => {

        // console.log(msg)

        const fileUri = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/" + sender + "---" + msg.createdTime

        FileSystem.getInfoAsync(folderUri)
          .then(info => {

            if (!info.exists) {
              return FileSystem.makeDirectoryAsync(folderUri).catch(err => { console.log(">>>", err) })
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


  socket.on("writeRoomMessage", function (sender, msgArr) {




    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + "AllUser" + "/"


    msgArr.forEach(msg => {

      //console.log(msg)

      //console.log(msg.createdTime,"\n",Date.now())
      const fileUri = folderUri + "AllUser" + "---" + msg.createdTime
      FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
        .then(() => {


          if (socket.listeners("displayRoomMessage").length === 0) {
            setLatestMsgObj(pre => {


              let objText = ""

              if (msg.audio) {
                objText = msg.sender + ": " + "[audio]"
              }
              else if (msg.image) {
                objText = msg.sender + ": " + "[image]"
              }
              else if (msg.text) {
                objText = msg.sender + ": " + msg.text
              }

              //return { ...pre, "AllUser": objText }
              return { ...pre, "AllUser": { content: objText, saidTime: msg.createdAt } }

            })
          }
        })
    })



  })


  socket.on("deleteAudio", function (id) {

    axios.get(`${url}/api/audio/delete/${id}`)

  })





  socket.on("disconnect", function (msg) {
    //  console.log("socket " + userName + " is disconnected")

  })








}



function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    Notifications.getPermissionsAsync().then(({ status: existingStatus }) => {

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        Notifications.requestPermissionsAsync().then(({ status }) => {
          finalStatus = status;

        })
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        alert('Failed to get push token for push notification!');
        return;
      }

    })
      .catch(err => { console.log(err) })


    return Notifications.getExpoPushTokenAsync().then(({ data }) => {
      token = data
      if (!token) {
        console.log('Unable to get notiToken on client site');
        alert('Unable to get notiToken on client site');
      }
      return token;
    })
      .catch(err => {
        //   console.log("====>", err)
        return err

      })
  }
  else {
    alert('Must use physical device for Push Notifications');
  }
}

