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

const messages_ = [

  {
    _id: Math.random(),
    text: '111拉克哇',
    createdAt: Date.now() + 1000 * 60,
    user: {
  //    _id: Math.random(),
      name: 'a',
  //    get avatar() { return () => { return <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(this.name, false)} /> } }
    },
  
  },

  {
    _id: Math.random(),
    text: '',
    createdAt: Date.now() + 1000 * 60,
    user: {
  //    _id: Math.random(),
      name: 'e',
  //    get avatar() { return () => { return <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(this.name, false)} /> } }
    },
    image: 'https://picsum.photos/200/300',
  },



]








export default function ContextProvider(props) {


  const [peopleList, setPeopleList] = useState(list)
  const [messageList, setMessageList] = useState(messages_)



  return <Context.Provider value={{

    peopleList,
    setPeopleList,

    messageList,
    setMessageList,

  }}>
    {props.children}
  </Context.Provider>


}