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
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";

//import Image from 'react-native-scalable-image';

import Lightbox from 'react-native-lightbox';
import ViewTransformer from "react-native-easy-view-transformer";

export function ImageScreen({ navigation, route, }) {

  const opacity = useSharedValue(0)




  const backStyle = useAnimatedStyle(() => {

    return {
      backgroundColor: "#333",
      position: "absolute",
      width,
      height,
      top: 0,
      left: 0,
      //   opacity: withTiming(opacity.value, { duration: 300 }),
    }

  })

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('transitionStart', (e) => {
  //     // Do something
  //     opacity.value = 0

  //   });

  //   return unsubscribe;
  // }, [navigation]);



  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('transitionEnd', (e) => {
  //     // Do something
  //     opacity.value = 1

  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const scrollX = useSharedValue(0)

  const scrollRef = useRef()


  const holdingTime = useRef(0)


  //console.log(route.params.imageId)
  return (

    <ScrollView style={{}}
      //   snapToAlignment={width}
      scrollEnabled={false}
      ref={scrollRef}
      horizontal={true}
      onScroll={function (e) {

        scrollX.value = e.nativeEvent.contentOffset.x
        // console.log(e.nativeEvent.contentOffset.x)

      }}
      snapToInterval={width}
      contentContainerStyle={{
        display: "flex", justifyContent: "center", alignItems: "center", height,

        backgroundColor: "pink"
      }}

    >


      {/* <View style={{ height, width,backgroundColor:"skyblue" }} >
        <Image source={{ uri: route.params.imageUrl }} resizeMode="contain" style={{ width, height }} />
      </View>

      <View style={{ height, width,backgroundColor:"lightorange" }} >
        <Image source={{ uri: "https://picsum.photos/200/300" }} resizeMode="contain" style={{ width, height }} />
      </View> */}




      <ViewTransformer maxScale={3}

        onTransformStart={function () {

          holdingTime.current = Date.now()

        }}

        onTransformGestureReleased={function ({ scale, translateX, translateY }) {

          if (scale === 1 && translateX < (-10)) {
            scrollRef.current.scrollTo({ x: scrollX.value + width, y: 0, animated: true })
          }
          else if (scale === 1 && translateX > (10)) {

            scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
          }
          else if ((scale === 1 && translateX === 0 && translateY === 0) && (Date.now() - holdingTime.current >= 300)) {

            alert("fdfsdf")


          }


          // else if(scale ===1 && translateX ===0 && translateY===0){
          //   Date.now()-holdingTime.current >=3000
          //   alert("fdfsdf")
          // }
        }}

        // onViewTransformed={function ({ scale, translateX, translateY }) {
        //   if ((scale === 1 && translateX === 0 && translateY === 0) && (Date.now() - holdingTime.current >= 3000)) {

        //     alert("fdfsdf")


        //   }
        // }}

      >
 {/* <Pressable onLongPress={function(){alert("fdf")}}> */}
        <SharedElement id={route.params.imageId}    >

          <Image source={{ uri: route.params.imageUrl }} resizeMode="contain" style={{ width, height }} />

        </SharedElement>
        {/* </Pressable> */}
      </ViewTransformer>


      <Pressable>
        <ViewTransformer maxScale={3}

          onTransformGestureReleased={function ({ scale, translateX, translateY }) {

            if (scale === 1 && translateX < (-10)) {
              scrollRef.current.scrollTo({ x: scrollX.value + width, y: 0, animated: true })
            }
            else if (scale === 1 && translateX > (10)) {

              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
            }
          }}
        >
          <SharedElement id={route.params.imageId}    >
            <Image source={{ uri: 'https://picsum.photos/200/300' }} resizeMode="contain" style={{ width, height }} />
          </SharedElement>
        </ViewTransformer>

      </Pressable>


    </ScrollView >

  )

}

ImageScreen.sharedElements = (route, otherRoute, showing) => {

  return [
    { id: route.params.imageId, animation: "move", resize: "clip", align: "auto", },

  ]
};