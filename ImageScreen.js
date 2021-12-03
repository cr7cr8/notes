import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from 'react-native';

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

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Overlay } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";

//import Image from 'react-native-scalable-image';

import Lightbox from 'react-native-lightbox';
import ViewTransformer from "react-native-easy-view-transformer";

export function ImageScreen({ navigation, route, }) {




  //console.log("====", route.params.imagePos)


  const scrollX = useSharedValue(route.params.imagePos * width)
  const scrollRef = useRef()
  const holdingTime = useRef(0)


  const [overLayOn, setOverLayOn] = useState(false)

  return (
    <>
      <ScrollView

        contentOffset={{ x: route.params.imagePos * width, y: 0 }}
        scrollEnabled={false}
        ref={scrollRef}
        horizontal={true}
        onScroll={function (e) { scrollX.value = e.nativeEvent.contentOffset.x }}


        snapToInterval={width}
        contentContainerStyle={{
          display: "flex", justifyContent: "center", alignItems: "center", height,
          backgroundColor: "pink"
          // backgroundColor: "333"
        }}

      >


        {route.params.messages.map((item, index) => {

          return (

            <ViewTransformer maxScale={3}


              onLongPress={function () { setOverLayOn(true) }}
              key={item._id}
              onTransformStart={function () { holdingTime.current = Date.now() }}

              onTransformGestureReleased={function ({ scale, translateX, translateY }) {

                if (scale === 1 && translateX < (-10)) {
                  scrollRef.current.scrollTo({ x: scrollX.value + width, y: 0, animated: true })
                }
                else if (scale === 1 && translateX > (10)) {

                  scrollRef.current.scrollTo({ x: scrollX.value - width, y: 0, animated: true })
                }
                else if ((scale === 1 && translateX === 0 && translateY === 0) && (Date.now() - holdingTime.current >= 300)) {
                  // setOverLayOn(true)
                }

              }}


            >

              <SharedElement id={item._id}>

                <Image source={{ uri: item.image }} resizeMode="contain" style={{ width, height }} />
              </SharedElement>

            </ViewTransformer>




          )

        })}




      </ScrollView >


      <Overlay isVisible={overLayOn} onBackdropPress={function () { setOverLayOn(false) }} >
        <Text>Hello from Overlay!</Text>
      </Overlay>
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

    ...messageArr,
  ]
};