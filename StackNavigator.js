import React, { useState, useEffect, useRef, useContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';

import { AppState, StyleSheet, Text, View, Button, Image, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RegScreen } from "./RegScreen";
import { HomeScreen } from "./HomeScreen";
import { ChatScreen } from "./ChatScreen";
import { ChatAllScreen } from "./ChatAllScreen";
import { ProfileScreen } from "./ProfileScreen";

import { ImageScreen } from "./ImageScreen";
import * as FileSystem from 'expo-file-system';
import { Context } from "./ContextProvider"

import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
const Stack = createSharedElementStackNavigator();

import { getStatusBarHeight } from 'react-native-status-bar-height';


import { createFolder, deleteFolder, hexToRgbA, hexify, } from "./config"
import multiavatar from '@multiavatar/multiavatar';


export default function StackNavigator() {



  const { token, setToken, notiToken, setNotiToken, userName, initialRouter, appState, peopleList } = useContext(Context)



  const avatarString = multiavatar(userName || " ")
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))


  const navigation = useNavigation()
  useEffect(function () {

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const item = peopleList.find(people => { return people.name === response.notification.request.content.title })
      navigation.navigate("Chat", { item })
    });

    return () => subscription.remove();

  }, [peopleList])







  const screenOptions = function ({ navigation, route }) {

    return {
      headerShown: true, //not supported in Android  //route.name!=="Chat",//true,//route.name==="Home",//true,
      gestureEnabled: true,
      gestureDirection: "horizontal",
      headerTitleAlign: 'center',
      ...TransitionPresets.SlideFromRightIOS,
      //  title: getFocusedRouteNameFromRoute(route) || "People",


      //header:function (props) {
      //  console.log("=====***==============")
      //  console.log(props)
      //},


      headerStyle: {
        height: getStatusBarHeight() > 24 ? 70 : 60,
        elevation: 1,
        backgroundColor: bgColor
      },




    }
  }
  //const navigation = useNavigation();



  return (
    <>

      <Stack.Navigator


        initialRouteName={initialRouter}



        screenOptions={screenOptions}
        // headerMode="float"
        headerMode="screen"

      >

        <Stack.Screen name="Reg"
          component={RegScreen}

          options={function ({ navigation, router }) {

            return {
              headerShown: false,
            }

          }}
        />


        <Stack.Screen name="Home"

          component={HomeScreen}

          // header={function (props) {     console.log(props)  return <Header {...props} /> }}

          options={function ({ navigation, route }) {

            return {
              headerShown: true,
              gestureEnabled: false,

              header: (props) => <Header {...props} />,

              headerLeft: () => null,
              headerRight: () => (
                <Button
                  title={userName}
                  onPress={async () => {

                    AsyncStorage.removeItem("token").then(function () {
                      setToken(null)
                    })
                    AsyncStorage.removeItem("notiToken").then(function () {
                      setNotiToken(null)
                    })

                    await FileSystem.deleteAsync(FileSystem.documentDirectory + "MessageFolder/", { idempotent: true })
                    await FileSystem.deleteAsync(FileSystem.documentDirectory + "UnreadFolder/", { idempotent: true })
                    await FileSystem.deleteAsync(FileSystem.cacheDirectory + "ImagePicker/", { idempotent: true })
                    await FileSystem.deleteAsync(FileSystem.documentDirectory + "Audio/", { idempotent: true })

                  }}
                />
              ),

              // color="#fff" 

              headerBackTitle: "Aaaa",




            }

          }}

        />


        <Stack.Screen name="Chat"

          component={ChatScreen}
          options={function ({ navigation, route }) {
            return {
              // headerRight: function(props) {     return <Button onPress={() => { }} title={"hihi"} />    },
              // headerShown:false, 
              // header: function (props) {   return <></>; return <Header {...props} /> },
              headerTintColor: 'green',  // back arrow color
              headerTitle: function (props) { return <></> },
              // headerBackTitle: "Aaaa", // only on ios
              //   headerBackAccessibilityLabel="ee",
              gestureEnabled: false,
              headerTransparent: true,
              // headerRight: () => {
              //   return <Button onPress={async function () {

              //     await deleteFolder(route.params.item.name)
              //     await createFolder(route.params.item.name)



              //   }} title="folder" />

              // },
            }
          }}
        />


        <Stack.Screen name="ChatAll"

          component={ChatAllScreen}
          options={function ({ navigation, route }) {
            return {
              // headerRight: function(props) {     return <Button onPress={() => { }} title={"hihi"} />    },
              // headerShown:false, 
              // header: function (props) {   return <></>; return <Header {...props} /> },
              headerTintColor: 'green',  // back arrow color
              headerTitle: function (props) { return <></> },

              //   headerBackAccessibilityLabel="ee",
              gestureEnabled: false,
              headerTransparent: true,
              // headerRight: () => {
              //   return <Button onPress={async function () {


              //     await deleteFolder("AllUser")
              //     await createFolder("AllUser")




              //   }} title="allchat" />

              // },
            }
          }}
        />

        <Stack.Screen name="Profile"
          component={ProfileScreen}
          options={function ({ navigaion, route }) {

            const avatarString = multiavatar(route.params.item.name)
            const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))

            return {
              headerShown: true,

              headerStyle: {
                height: getStatusBarHeight() > 24 ? 70 : 60,
                elevation: 0,
                backgroundColor: bgColor
              },


              header: (props) => <Header {...props} />,
              headerTitle: function (props) { return <Text style={{ fontSize: 20 }}>{route.params.item.name}</Text> },
              //      headerTintColor: 'transparent',
              //       headerTransparent: true,

            }
          }}
        />




        < Stack.Screen name="Image"
          component={ImageScreen}
          options={
            function ({ navigaion, route }) {

              return {
                headerShown: true,
                headerTitle: function (props) { return <></> },
                headerTintColor: 'transparent',
                headerTransparent: true,

              }
            }
          }

        />



      </Stack.Navigator>



    </>

  )

}


