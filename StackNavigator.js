import React, { useState } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Text, View, Button, Image, } from 'react-native';

import { HomeScreen } from "./HomeScreen";
import { ChatScreen } from "./ChatScreen";


const Stack = createSharedElementStackNavigator();


export default function StackNavigator() {

  const [page, setPage] = useState("Home")

  const screenOptions = function ({ navigation, route }) {

    //console.log(route)

    return {
      headerShown: true,//route.name!=="Chat",//true,//route.name==="Home",//true,
      gestureEnabled: true,
      gestureDirection: "horizontal",
      headerTitleAlign: 'center',
      ...TransitionPresets.SlideFromRightIOS,
      //  title: getFocusedRouteNameFromRoute(route) || "People",

      headerStyle: {
        height: 60,
        elevation: 1,
      },

    }
  }


  return (

    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
      // headerMode="float"
      headerMode="screen"
    >

      <Stack.Screen name="Home"

        component={HomeScreen}
        options={function () {

          return {
            headerRight: () => (
              <Button
                onPress={() => { }}
                title={"hihi"}
              // color="#fff"
              />
            )
          }

        }}

      />


      <Stack.Screen name="Chat"

        component={ChatScreen}
        options={function () {

          return {
          //  headerRight: function(props) {     return <Button onPress={() => { }} title={"hihi"} />    },
           
        
            headerTitle: function (props) { return <></> },
            gestureEnabled: true,
            headerTransparent: true,
          }
        }}
      />


    </Stack.Navigator>

  )

}


