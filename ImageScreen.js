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



export function ImageScreen({ navigation, route, }) {

  const item = route.params.item
  const avatarString = multiavatar(item.name)

  const scrollRef = useRef()
  const scrollX = useSharedValue(route.params.imagePos * width)

  const [overLayOn, setOverLayOn] = useState(false)

  const [btnText, setBtnText] = useState("Download")


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
              onLongPress={function () { Vibration.vibrate(50); setOverLayOn(true) }}

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

      <OverlayDownloader
        overLayOn={overLayOn}
        setOverLayOn={setOverLayOn}
        uri={route.params.messages[Math.floor(scrollX.value / width)].image}
        fileName={Date.now() + ".jpg"}
      />
      {/* <Overlay isVisible={overLayOn} fullScreen={false}
        overlayStyle={{

          position: "relative",
          width: 0.8 * width,
          display: "flex",
          alignItems: "center"
        }}
        onBackdropPress={function () { if (btnText === "Download" || btnText === "100%") { setBtnText("Download"); setOverLayOn(false) } }}
      >

        {btnText !== "Download" && <LinearProgress color="primary" value={1} variant={btnText === "100%" ? "determinate" : "indeterminate"} style={{ height: 5, width: 0.8 * width, position: "absolute", zIndex: 10 }} />}
        {btnText !== "Download" && btnText !== "100%" && <Button disabled={true} title={btnText} />}
        {btnText === "Download" && <Button title={btnText} disabled={btnText !== "Download"} onPress={async function (props) {


          setBtnText("0%")
          const obj = route.params.messages[Math.floor(scrollX.value / width)]
          const uri = obj.image
          //const uri = "https://picsum.photos/100/102" obj.image

          const fileUri = `${FileSystem.documentDirectory}${obj._id}.jpg`
          //const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`

          //  console.log(uri)


          const downloadResumable = FileSystem.createDownloadResumable(
            uri, fileUri, { headers: { token: "hihihi" } },

            function ({ totalBytesExpectedToWrite, totalBytesWritten }) {

              console.log(totalBytesExpectedToWrite, totalBytesWritten)

              if (totalBytesExpectedToWrite === -1) { setBtnText("100%") }
              else {
                // console.log(Math.floor(totalBytesWritten / totalBytesExpectedToWrite * 100))
                setBtnText(Math.floor(totalBytesWritten / totalBytesExpectedToWrite * 100) + "%")
              }


            }
          );


          const { status, ...rest } = await downloadResumable.downloadAsync(uri, fileUri, { headers: { token: "hihihi" } }).catch(e => { console.log(e) })

          //  console.log(rest)

          if (status == 200) {
            const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
            if (!granted) { return }
            else {

              const asset = await MediaLibrary.createAssetAsync(fileUri).catch(e => { console.log(e) });
              const album = await MediaLibrary.getAlbumAsync('ttt').catch(e => { console.log(e) });

              //console.log(album)

              if (album == null) {
                await MediaLibrary.createAlbumAsync('ttt', asset, false).catch(e => { console.log(e) });
              }
              else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).catch(e => { console.log(e) });
              }
            }
          }
          else { alert("server refuse to send") }


        }} />
        }
        {btnText === "100%" && <Button title="Finished" onPress={function () {

          setBtnText("Download")
          setOverLayOn(false)
        }} />}

      </Overlay> */}

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

