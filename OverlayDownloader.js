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

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Divider } from 'react-native-elements'
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
 
  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(data => {
  //   data.forEach(filename_ => {
  //     // console.log("=cached image==***===" + filename_)
  //     // FileSystem.deleteAsync(FileSystem.documentDirectory + filename_, { idempotent: true })
  //   })
  // })

  // FileSystem.readDirectoryAsync("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cr7cr8%252Fnotes/ImagePicker/").then(data => {
  //   data.forEach(filename_ => {
  //       console.log(Date.now() + "=cached photo==***===" + filename_)
  //       FileSystem.deleteAsync("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cr7cr8%252Fnotes/ImagePicker/" + filename_, { idempotent: true })
  //   })

  // })


  //const [overLayOn, setOverLayOn] = useState(false)

  const [btnText, setBtnText] = useState("Download")
  //const [deleteBtnText, setDeleteBtnText] = useState("Delete")



  // console.log(uri, "-------------------", fileName)
  return (
    <>


      <Overlay isVisible={overLayOn} fullScreen={false}

        overlayStyle={{

          position: "relative",
          width: 0.8 * width,
          //height: 0.5 * height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
        onBackdropPress={function () { if (btnText === "Download" || btnText === "100%") { setBtnText("Download"); setOverLayOn(false) } }}
      >

        {btnText !== "Download" && <LinearProgress color="primary" value={1}
          variant={(btnText === "100%") ? "determinate" : "indeterminate"}
          style={{ height: 5, width: 0.8 * width, position: "absolute", top: 0, zIndex: 10 }}
        />}


        {btnText !== "Download" && btnText !== "100%" && <Button disabled={true} title={btnText} />}
        {btnText === "Download" && <Button title={btnText} disabled={(btnText !== "Download") } onPress={async function (props) {


          if (uri.indexOf("data") === 0) {
            downloadFromBase64(uri, fileName, setBtnText)
          }
          else if (uri.indexOf("file") === 0) {
            downloadFromLocal(uri, fileName, setBtnText)
          }
          else {
            downloadFromUri(uri, fileName, setBtnText)
          }

        }} />
        }
        {btnText === "100%" && <Button title="Finished" onPress={function () {

          setBtnText("Download")
          setOverLayOn(false)
        }} />}


        {/* <Divider orientation="horizontal" height={8} /> */}

        {/* <Button title={deleteBtnText} disabled={deleteBtnText!=="Delete"} style={{ marginVertical: 8 }} onPress={function () {
          deleteFromLocal(uri, fileName, setDeleteBtnText)
          //console.log(uri)
        }} /> */}

      </Overlay>

    </>
  )

}

async function downloadFromUri(uri, fileName, setBtnText) {

  setBtnText("0%")

  const fileUri = `${FileSystem.documentDirectory}${fileName}`
  const downloadResumable = FileSystem.createDownloadResumable(
    uri, fileUri, { headers: { token: "hihihi" } },
    function ({ totalBytesExpectedToWrite, totalBytesWritten }) {
      totalBytesExpectedToWrite === -1
        ? setBtnText("100%")
        : setBtnText(Math.floor(totalBytesWritten / totalBytesExpectedToWrite * 100) + "%")
    }
  );

  const { status } = await downloadResumable.downloadAsync(uri, fileUri, { headers: { token: "hihihi" } }).catch(e => { console.log(e) })

  if (status == 200) {
    const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
    if (!granted) { setBtnText("100%"); return }

    const asset = await MediaLibrary.createAssetAsync(fileUri).catch(e => { console.log(e) });
    let album = await MediaLibrary.getAlbumAsync('expoDownload').catch(e => { console.log(e) });

    if (album == null) { await MediaLibrary.createAlbumAsync('expoDownload', asset, false).catch(e => { console.log(e) }); }
    else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).catch(e => { console.log(e) });
    }
    await FileSystem.deleteAsync(fileUri, { idempotent: true })
  }
  else { alert("server refuse to send") }

}

async function downloadFromBase64(uri, fileName, setBtnText) {


  setBtnText("0%")
  const base64Code = uri.split("data:image/png;base64,")[1];

  const fileUri = FileSystem.documentDirectory + fileName;
  await FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64, });
  // console.log(base64Code)
  // console.log(fileUri)

  const asset = await MediaLibrary.createAssetAsync(fileUri)
  let album = await MediaLibrary.getAlbumAsync('expoDownload')
  if (album == null) { await MediaLibrary.createAlbumAsync('expoDownload', asset, true) }
  else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
  }

  await FileSystem.deleteAsync(fileUri, { idempotent: true })


  //const mediaResult = await MediaLibrary.saveToLibraryAsync(filename);

  setBtnText("100%")
}

async function downloadFromLocal(uri, fileName, setBtnText) {

  setBtnText("0%")

  const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
  if (!granted) { setBtnText("100%"); return }

  const asset = await MediaLibrary.createAssetAsync(uri)
  let album = await MediaLibrary.getAlbumAsync('expoDownload')
  if (album == null) { await MediaLibrary.createAlbumAsync('expoDownload', asset, true) }
  else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, true)
  }

  setBtnText("100%")


}

// async function deleteFromLocal(uri, fileName, setDeleteBtnText) {
//   setDeleteBtnText("0%")
//   const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
//   if (!granted) { setDeleteBtnText("100%"); return }


//   await FileSystem.deleteAsync(uri, { idempotent: true })
//   setDeleteBtnText("100%")

// }
