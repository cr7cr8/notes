import React, { useState, useEffect, useRef } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle, Header } from '@react-navigation/stack';

import { useNavigation } from '@react-navigation/native';

import { StyleSheet, Text, View, Button, Image, } from 'react-native';

import { HomeScreen } from "./HomeScreen";
import { ChatScreen } from "./ChatScreen";
import { ImageScreen } from "./ImageScreen";

const Stack = createSharedElementStackNavigator();


export default function StackNavigator() {





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

    <Stack.Navigator
      initialRouteName="Home"



      screenOptions={screenOptions}
      // headerMode="float"
      headerMode="screen"

    >

      <Stack.Screen name="Home"

        component={HomeScreen}

        // header={function (props) {     console.log(props)  return <Header {...props} /> }}

        options={function ({ navigation, router }) {

          return {
            headerShown: true,
            header: (props) => <Header {...props} />,

            headerRight: () => (<Button onPress={() => { }} title={"hihi"} />), // color="#fff" 

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
            gestureEnabled: true,
            headerTransparent: true,
          }
        }}
      />
      <Stack.Screen name="Image"
        component={ImageScreen}
        options={function({navigaion,router}){

          return{
            headerShown:false

          }
        }}

      />



    </Stack.Navigator>





  )

}


