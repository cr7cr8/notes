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




  const frameStyle = useAnimatedStyle(() => {

    return {

      // opacity:withTiming(opacity.value,{duration:6000}),
    }

  })

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


  const scale = useSharedValue(1)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)

  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, obj) => {


      // obj.preScale = scale.value
      // obj.preFX = focalX.value
      // obj.preFY = focalX.value
    },


    onActive: (event, obj) => {

      focalX.value = event.focalX
      focalY.value = event.focalY
      scale.value = event.scale
    },

    onEnd: (event, obj) => {
      if (event.scale < 1) {
        //  scale.value = withTiming(1, { duration: 200 })
      }
    }

  })

  const imageStyle = useAnimatedStyle(() => {

    return {


      width,
      height,
      backgroundColor: "pink",
      position:"absolute",

      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },

        { scale: scale.value },

        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },

      ],



    }


  })

  // return <Lightbox >
  //   <Image
  //     style={{ height: 300 }}
  //     source={{ uri: route.params.imageUrl }}
  //   />
  // </Lightbox>



  //console.log(route.params.imageId)
  return (

    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width, height, }}>
      <View style={[backStyle]} />



      {/* <ViewTransformer maxScale={3} >
        <SharedElement id={route.params.imageId}    >
          <Image source={{ uri: route.params.imageUrl }} resizeMode="contain" style={{ width, height }} />
        </SharedElement>
      </ViewTransformer> */}



      <View style={[imageStyle]}>





        <PinchGestureHandler onGestureEvent={gestureHandler}>
          <View>
            <SharedElement id={route.params.imageId}>
              <ImageBackground source={{ uri: route.params.imageUrl }} resizeMode="contain" style={{ width, height, }} />
            </SharedElement>


          </View>
        </PinchGestureHandler>


      </View>





    </View >

  )

}

ImageScreen.sharedElements = (route, otherRoute, showing) => {

  return [
    { id: route.params.imageId, animation: "move", resize: "clip", align: "auto", },

  ]
};