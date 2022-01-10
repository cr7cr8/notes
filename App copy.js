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






import React, { useState, useRef, useEffect, useContext, useLayoutEffect} from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { AppState, StyleSheet, Dimensions, TouchableOpacity, 
  SafeAreaView,
  TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from 'react-native';

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
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import * as FileSystem from 'expo-file-system';

//import Image from 'react-native-scalable-image';

import Lightbox from 'react-native-lightbox';
import ViewTransformer from "react-native-easy-view-transformer";

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SnackBar from "./SnackBar";

import axios from "axios";
import jwtDecode from 'jwt-decode';
import { io } from "socket.io-client";
import url from "./config";



export default function App() { return (<ContextProvider><AppStarter /></ContextProvider>) }

const BACKGROUND_FETCH_TASK = 'background-location-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),

  handleSuccess: (notificationId) => {
    // console.log(notificationId)
  },

});




// TaskManager.defineTask(BACKGROUND_FETCH_TASK, ({ data, error }) => {

//   console.log(`Got background fetch call at: ${new Date().toISOString()}`)
//   checkStatusAsync()
//   return BackgroundFetch.BackgroundFetchResult.NewData;

// });

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 1 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

// async function checkStatusAsync() {
//   const status = await BackgroundFetch.getStatusAsync();
//   const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
//   console.log(status)
//   console.log(isRegistered)

// };

function AppStarter() {

  const { userName, token, setToken, notiToken, setNotiToken, initialRouter, setInitialRouter, socket, appState, setUnreadCountObj } = useContext(Context)

  useEffect(() => {

    const subscription = AppState.addEventListener("change", nextAppState => {
      appState.current = nextAppState;  //inactive background active
      setUnreadCountObj(pre => { return { ...pre } })

      //console.log("AppState", appState.current);
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);



  useEffect(function () {


    if (socket) {

      //     // TaskManager.defineTask(BACKGROUND_FETCH_TASK, ({ data, error }) => {
      //     //   console.log(`Got background fetch call at: ${new Date().toISOString()}`)
      //     //   socket.emit("helloFromClient", new Date().toISOString())
      //     //   return BackgroundFetch.BackgroundFetchResult.NewData;
      //     // });
      //     // setTimeout(registerBackgroundFetchAsync,1000)  

      //  socket.on("saveUnread", function (sender, msgArr) {

      //   if ((socket.listeners("displayMessage" + sender).length === 0) || appState.current === "background" || appState.current === "inactive") {

      //     msgArr.forEach((msg, index) => {
      //       console.log("index", index)
      //       const fileUri = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/" + sender + "---" + msg.createdTime

      //       FileSystem.getInfoAsync(folderUri)
      //         .then(info => {

      //           if (!info.exists) {
      //             return FileSystem.makeDirectoryAsync(folderUri)
      //           }
      //           else {
      //             return info
      //           }
      //         })
      //         .then(() => {
      //           return FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))


      //         })
      //         .then(() => {
      //           FileSystem.readDirectoryAsync(folderUri).then(data => {
      //             console.log("---", data)
      //           })
      //         })


      //     });




      //   }


      //  })


      // socket.on("checkListeners", function (sender, msgArr) {
      //   if ((socket.listeners("displayMessage" + sender).length === 0) || appState.current === "background" || appState.current === "inactive") {
      //     Notifications.scheduleNotificationAsync({
      //       content: {
      //         title: sender,
      //         body: msgArr[0].text + " made by local",
      //       },
      //       trigger: null// { seconds: 2 },
      //     });
      //   }
      // })



    } //ifsocket


  }, [socket])


  // useEffect(function () {
  //   return unregisterBackgroundFetchAsync
  // }, [])

  useEffect(function () {

    if (token && notiToken && socket) {
      // console.log("hihihihi")

      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      //socket.emit("sendNotiToken", notiToken)

    }


  }, [socket, notiToken, token])


  // useEffect(function () {
  //   checkStatusAsync()
  // })


  useEffect(function () {

    if (!initialRouter) {


      AsyncStorage.getItem("notiToken").then(notiToken => {

        if (notiToken) {
          setNotiToken(notiToken)
        }
        else {
          registerForPushNotificationsAsync().then(notiToken => {
            setNotiToken(notiToken)
            AsyncStorage.setItem("notiToken", notiToken)
          })
        }
      })


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


  useEffect(function () {

    if (token && notiToken) {
      console.log("sending notiToken", userName, notiToken)
      axios.post(`${url}/api/user/updatenotitoken`, { notiToken: notiToken }, { headers: { "x-auth-token": token } })
    }
  }, [token, notiToken])




  if (initialRouter) {
    return (
      <>
        <NavigationContainer

        // linking={{
        //   prefixes: ['https://mychat.com', 'mychat://'],
        //   config: {
        //     screens: {
        //       Home: 'feed/:sort',
        //     },
        //   },
        // }}

        >
          <StackNavigator />
        </NavigationContainer>
        <SnackBar />
      </>
    )
  }

  return <></>


}




async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }



    token = (await Notifications.getExpoPushTokenAsync()).data;
    if (!token) {
      alert('Unable to get notiToken on client site');
    }
    return token;
    // console.log(token);
  }
  else {
    alert('Must use physical device for Push Notifications');
  }

  // if (Platform.OS === 'android') {
  //   Notifications.setNotificationChannelAsync('default', {
  //     name: 'default',
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
  // }


}
















const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
