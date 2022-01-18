import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight,
  TouchableWithoutFeedback, ImageBackground,

  PermissionsAndroid,
  Platform,
  Animated,
  Vibration
} from 'react-native';

import * as FileSystem from 'expo-file-system';



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
const { View, Text, ScrollView: ScrollV, Image } = ReAnimated

import url, { hexToRgbA, hexify, uniqByKeepFirst } from "./config";
//import Image from 'react-native-scalable-image';

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';



import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";

//import Image from 'react-native-scalable-image';

import Lightbox from 'react-native-lightbox';
import ViewTransformer from "react-native-easy-view-transformer";
import { getStatusBarHeight } from 'react-native-status-bar-height';

import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

import { downloadToFolder } from 'expo-file-dl';

import { OverlayDownloader } from "./OverlayDownloader";
import * as ImagePicker from 'expo-image-picker';


export function ImageScreen({ navigation, route, }) {

  const { peopleList } = useContext(Context)

  const item = peopleList.find(people => { return people.name === route.params.item.name })

  const avatarName = route.params.item.name

  const avatarString = multiavatar(item.name)

  const scrollRef = useRef()
  const scrollX = useSharedValue(route.params.imagePos * width)

  const [overLayOn, setOverLayOn] = useState(false)





  return (
    <>

      <View style={{ height: 0, backgroundColor: "yellow" }}>
        <SharedElement id={item.name} style={{ transform: [{ scale: 0 }], borderRadius: 1000 }}   >
          {/* <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={avatarString} /> */}
          {item.hasAvatar
            ? <Image source={{ uri: `${url}/api/image/avatar/${item.name}?${item.randomStr}` }} resizeMode="cover"
              style={{
                position: "relative",
                top: getStatusBarHeight(),
                width: 60, height: 60, borderRadius: 1000
              }} />
            : <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
          }


        </SharedElement>
      </View>




      <ScrollView

        contentOffset={{ x: route.params.imagePos * width, y: 0 }}
        scrollEnabled={false}
        ref={scrollRef}
        horizontal={true}
        onScroll={function (e) { scrollX.value = e.nativeEvent.contentOffset.x }}

        snapToInterval={width}
        contentContainerStyle={{
          display: "flex", justifyContent: "center", alignItems: "center", height,
          //backgroundColor: "pink"
          backgroundColor: "#333"
        }}

      >


        {route.params.messages.map((item, index, arr) => {

          return (

            <ViewTransformer maxScale={2.5}

              arrLength={arr.length}
              onLongPress={function () {
                Vibration.vibrate(50);

                if (!item.isSvg) { setOverLayOn(true) }
                else { alert("svg image downloading not supported") }



              }}

              key={item._id || index}
              onTransformStart={function () { }}
              onTransformGestureReleased={function ({ scale, translateX, translateY }) {

                if (scale === 1 && translateX < (-10)) {
                  scrollRef.current.scrollTo({ x: (index + 1) * width, y: 0, animated: true })
                }
                else if (scale === 1 && translateX > (10)) {
                  scrollRef.current.scrollTo({ x: (index - 1) * width, y: 0, animated: true })
                }
              }}
            >

              <SharedElement id={item._id}>
                {item.image
                  ? <Image source={{ uri: item.image, headers: { token: "hihihi" } }} resizeMode="contain" style={{ width, height }} />
                  : <SvgUri style={{ position: "relative", /*top: getStatusBarHeight() */ }} width={width} height={height} svgXmlData={multiavatar(avatarName)} />
                }



              </SharedElement>

            </ViewTransformer>
          )

        })}
      </ScrollView >

      <OverlayDownloader
        overLayOn={overLayOn}
        setOverLayOn={setOverLayOn}
        uri={route.params.messages[Math.floor(scrollX.value / width)].image}
        fileName={Date.now() + ".jpg"}
      />

    </>
  )

}



ImageScreen.sharedElements = (route, otherRoute, showing) => {

  let messageArr = []
  if (route && route.params && route.params.messages) {


    messageArr = route.params.messages.map(item => {
      return { id: item._id, animation: "move", resize: "auto", align: "left" }
    })

  }


  return [
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },
    ...messageArr,
  ]
};

