import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, UIManager, findNodeHandle } from 'react-native';

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
  measure,
  useAnimatedRef

} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, Image: ImageV, ScrollView: ScrollV } = ReAnimated



import { ListItem, Avatar, LinearProgress, Button, Tooltip, Icon } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';


import { SharedElement } from 'react-navigation-shared-element';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Context } from "./ContextProvider"

import { GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer, MessageImage } from 'react-native-gifted-chat'
import { Video, AVPlaybackStatus } from 'expo-av';

import Image from 'react-native-scalable-image';

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { OverlayDownloader } from "./OverlayDownloader";
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';



export default function SnackBar({ ...props }) {

  const { snackBarHeight, setSnackBarHeight, snackMsg, setSnackMsg } = useContext(Context)
  const height = useDerivedValue(() => { return snackBarHeight })

  useEffect(function () {

    if (snackBarHeight === 60) {
      setTimeout(() => {
        setSnackBarHeight(0)
      }, 500);
    }

  }, [snackBarHeight])


  const style = useAnimatedStyle(() => {

    return {
      width,
      height: withTiming(height.value),
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "#333",

      display: "flex",

      zIndex: 100,

      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    }
  })





  return (



    <View style={style}>


      <Text style={{ color: "white", fontSize: 15, }}>{snackMsg}</Text>

      <Icon
        containerStyle={{ position: "absolute", right: 9, transform: [{ translateY: 2 }] }}
        name="close-outline"
        type='ionicon'
        color='white'
        size={30}
        onPress={function () {
          height.value = 0
          setTimeout(() => {
            setSnackBarHeight(0)
          }, 300);

        }}
      />

    </View>

  )
}