import React, { useState, useEffect, useRef, useContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';

import { AppState, StyleSheet, Text, View, Button, Image, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RegScreen } from "./RegScreen";
import { HomeScreen } from "./HomeScreen";
import { ChatScreen } from "./ChatScreen";
import { ImageScreen } from "./ImageScreen";
import * as FileSystem from 'expo-file-system';
import { Context } from "./ContextProvider"

import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
const Stack = createSharedElementStackNavigator();




export default function StackNavigator() {



  const { token, setToken, notiToken, setNotiToken, userName, initialRouter, appState, peopleList } = useContext(Context)

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
        height: 60,
        elevation: 1,
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

          options={function ({ navigation, router }) {

            return {
              headerShown: true,
              gestureEnabled: false,

              header: (props) => <Header {...props} />,

              //  headerLeft: () => null,
              headerRight: () => (<Button onPress={async () => {

                AsyncStorage.removeItem("token").then(function () {
                  setToken(null)
                })
                AsyncStorage.removeItem("notiToken").then(function () {
                  setNotiToken(null)
                })



                await FileSystem.deleteAsync(FileSystem.documentDirectory + "MessageFolder/", { idempotent: true })
                await FileSystem.deleteAsync(FileSystem.documentDirectory + "UnreadFolder/", { idempotent: true })
                await FileSystem.deleteAsync(FileSystem.documentDirectory + "ImagePicker/", { idempotent: true })


                FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "MessageFolder/")
                FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "UnreadFolder/")


              }} title={userName} />), // color="#fff" 

              headerBackTitle: "Aaaa",




            }

          }}

        />


        <Stack.Screen name="Chat"

          component={ChatScreen}
          options={function ({ navigation, router }) {
            return {
              // headerRight: function(props) {     return <Button onPress={() => { }} title={"hihi"} />    },
              // headerShown:false, 
              // header: function (props) {   return <></>; return <Header {...props} /> },
              headerTintColor: 'green',  // back arrow color
              headerTitle: function (props) { return <></> },
              headerBackTitle: "Aaaa",
              //   headerBackAccessibilityLabel="ee",
              gestureEnabled: false,
              headerTransparent: true,
              headerRight: () => (<Button onPress={async function () {

                await FileSystem.deleteAsync(FileSystem.documentDirectory + "MessageFolder/", { idempotent: true })
                await FileSystem.deleteAsync(FileSystem.documentDirectory + "UnreadFolder/", { idempotent: true })
                await FileSystem.deleteAsync(FileSystem.documentDirectory + "ImagePicker/", { idempotent: true })


                FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "MessageFolder/")
                FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "UnreadFolder/")


              }} title="folder" />),
            }
          }}
        />
        <Stack.Screen name="Image"
          component={ImageScreen}
          options={function ({ navigaion, router }) {

            return {
              headerShown: true,
              headerTitle: function (props) { return <></> },
              headerTintColor: 'transparent',
              headerTransparent: true,

            }
          }}

        />



      </Stack.Navigator>



    </>

  )

}


