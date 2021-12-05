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





export function OverlayDownloader({ overLayOn, setOverLayOn, uri, fileName, ...props }) {


  //const [overLayOn, setOverLayOn] = useState(false)

  const [btnText, setBtnText] = useState("Download")

  // console.log(uri, "-------------------", fileName)
  return (
    <>


      <Overlay isVisible={overLayOn} fullScreen={false}
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

          //  const uri = uri // obj.image


          const fileUri = `${FileSystem.documentDirectory}${fileName}`
          // console.log("====",uri, fileUri)



          const downloadResumable = FileSystem.createDownloadResumable(
            uri, fileUri, { headers: { token: "hihihi" } },

            function ({ totalBytesExpectedToWrite, totalBytesWritten }) {

              //console.log(totalBytesExpectedToWrite, totalBytesWritten)

              if (totalBytesExpectedToWrite === -1) { setBtnText("100%") }
              else {
                // console.log(Math.floor(totalBytesWritten / totalBytesExpectedToWrite * 100))
                setBtnText(Math.floor(totalBytesWritten / totalBytesExpectedToWrite * 100) + "%")
              }


            }
          );


          const { status,  } = await downloadResumable.downloadAsync(uri, fileUri, { headers: { token: "hihihi" } }).catch(e => { console.log(e) })



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

      </Overlay>

    </>
  )

}








