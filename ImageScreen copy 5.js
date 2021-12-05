import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight,
  TouchableWithoutFeedback, ImageBackground,

  PermissionsAndroid,
  Platform,


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
import { getStatusBarHeight } from 'react-native-status-bar-height';

import * as MediaLibrary from 'expo-media-library';

// import FileSystem from "expo-file-system";

// console.log(FileSystem)

//import RNFetchBlob from 'rn-fetch-blob';

//console.log(RNFetchBlob)
//const { config, fs } = RNFetchBlob;


import { downloadToFolder } from 'expo-file-dl';

// console.log(FileSystem.documentDirectory)

// const callback = () => { };

// const downloadResumable = FileSystem.createDownloadResumable(
//  // 'http://techslides.com/demos/sample-videos/small.mp4',
//  "https://picsum.photos/200/300",
//  "file:///data/"+ 'small.jpg',
//   {},
//   callback
// );

//  downloadResumable.downloadAsync().then(uri=>{
//   console.log('Finished downloading to ', uri);

//  });




export function ImageScreen({ navigation, route, }) {

  const item = route.params.item
  const avatarString = multiavatar(item.name)

  const scrollRef = useRef()
  const [overLayOn, setOverLayOn] = useState(false)

  const scrollX = useSharedValue(route.params.imagePos * width)

  // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(status => {

  //   //if(status==="")
  //   console.log(status, PermissionsAndroid.RESULTS.GRANTED)

  //   if (status === PermissionsAndroid.RESULTS.GRANTED) {

  //   }

  // })




  return (
    <>


      <View style={{ overflow: "hidden", height: 0, backgroundColor: "yellow" }}>
        <SharedElement id={item.name} style={{ transform: [{ scale: 0 }], }}   >
          <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={avatarString} />
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

              onLongPress={function () { setOverLayOn(true) }}


              key={item._id}
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

                <Image source={{ uri: item.image }} resizeMode="contain" style={{ width, height }} />
              </SharedElement>

            </ViewTransformer>




          )

        })}




      </ScrollView >


      <Overlay isVisible={overLayOn} onBackdropPress={function () { setOverLayOn(false) }} >
        <Text>Hello from Overlay!</Text>
        <Button title="ssds" onPress={function (props) {

          // console.log(MediaLibrary.PermissionStatus)

          MediaLibrary.requestPermissionsAsync().then(result => {
            if (result.granted) {

              const obj = route.params.messages[Math.floor(scrollX.value / width)]

              downloadToFolder(obj.image, `${obj._id}.jpg`, "./", obj._id)
              //  downloadToFolder("https://picsum.photos/200/100", "xyza.jpg", "./", "iiiddd")

            }

          })
          // MediaLibrary.requestPermissionsAsync().then(result=>{
          //   console.log(result)
          // })

          // downloadToFolder("https://picsum.photos/200/100", "xyza.jpg", "./", "iiiddd")


        }} />
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
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },
    ...messageArr,
  ]
};







