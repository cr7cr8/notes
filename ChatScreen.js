import React, { useState, useRef, useEffect, useContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, } from 'react-native';

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
const { View, Text, Image, ScrollView: ScrollV } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';


import { Context } from "./ContextProvider"


export function ChatScreen({ navigation, route, ...props }) {


  const { peopleList, setPeopleList } = useContext(Context)

  //console.log(route.params.item)
  const item = route.params.item
console.log(item.name)
  return (
    <>
      {/* <SharedElement id={"555"} style={{ transform: [{ scale: 9 }, { translateY: 300 }] }}  >
        <Text>{item.name}</Text>
      </SharedElement> */}




      <SharedElement id={item.name} style={{transform:[{scale:0.5}]}}   >
        <SvgUri style={{ margin: 10, }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
        {/* <Image
          source={{ uri: "https://picsum.photos/200/300" }}
          style={{ width: 60, height: 60, resizeMode: "contain", }}

        /> */}

      </SharedElement>

    </>
  )
}


ChatScreen.sharedElements = (route, otherRoute, showing) => [
  { id: route.params.item.name + "-logo", animation: "move", resize: "clip", align: 'left-center', },
  { id: route.params.item.key, animation: "move", resize: "clip", align: 'left-center', },
  { id: "111", animation: "fade", resize: "auto", align: 'left-center', },
  { id: "222", animation: "fade", resize: "auto", align: 'left-center', },
  { id: "333", animation: "fade", resize: "auto", align: 'left-center', },

  { id: "444", animation: "fade", resize: "auto", align: 'left-center', },

  { id: "555", animation: "resize", resize: "clip", align: 'left-center', },



{ id:  route.params.item.name, animation: "move", resize: "auto", align: 'left-center', },

];