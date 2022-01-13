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
import url, { createFolder } from "./config";


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

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Input } from 'react-native-elements'
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




export function RegScreen({ navigation, route, ...props }) {


  const { setInitialRouter, setToken, notiToken, setPeopleList, socket } = useContext(Context)
  const reg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]{2,14}$/g;

  const inputRef = useRef(null)
  const [value, setValue] = useState("User" + String(Date.now()).slice(-3))

  const [avatarUri, setAvatarUri] = useState("")

  const [forceDisable, setForceDisable] = useState(false)

  const style = useAnimatedStyle(() => {

    return {
      flex: 1,
      display: "flex",
      alignItems: 'center',
      justifyContent: 'flex-start',

    }

  })

  useEffect(function () {

    //  inputRef.current.shake()
  }, [])

  return (

    <View style={style}>

      <TouchableOpacity style={{ position: "absolute", top: 0.3 * height - 100 }}
        onPress={function () {
          pickImage(value, setAvatarUri)
        }}
        onLongPress={function () {

          setAvatarUri("")

        }}
      >
        <SharedElement id={value}  >
          {avatarUri
            ? <Image source={{ uri: avatarUri }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 1000 }} />
            : <SvgUri width={80} height={80} svgXmlData={multiavatar(value || Math.random())} />
          }
        </SharedElement>
      </TouchableOpacity>

      <View style={{ position: "absolute", top: 0.3 * height }}>
        <Input ref={inputRef} placeholder='Enter a name'
          disabled={forceDisable}
          inputContainerStyle={{ width: 0.8 * width }}
          onPressIn={function () { inputRef.current.blur(); inputRef.current.focus() }}
          value={value}
          textAlign={value ? 'center' : "left"}
          errorMessage={value.match(reg) ? "" : value ? "invalid name" : ""}

          onChangeText={function (text) {
            setValue(text)
          }}
        />
      </View>
      <Button disabled={!value.match(reg) || forceDisable} title="OK" raised={true} containerStyle={{ position: "absolute", top: height * 0.3 + 100, width: width * 0.8 }}
        loading={forceDisable}
        loadingProps={{ color: "#a0a0a0" }}
        onPress={async function (e) {
          setForceDisable(true)



          const { data: isNewName } = await axios.post(`${url}/api/user/isnewname`, { userName: value })
          // console.log(isNewName)
          if (isNewName) {
            avatarUri
              ? regUserWithAvatar(value, avatarUri).then( async (response) => {
                await createFolder(value)
                setForceDisable(false)
               
              
               
                setToken(response.headers["x-auth-token"])
                //  setInitialRouter("Home")
                //  setAvatarUri(`${url}/api/image/avatar/${value}`)

                AsyncStorage.setItem("token", response.headers["x-auth-token"])

                setPeopleList([{ name: value, hasAvatar: true, key: Math.random(), localImage: avatarUri }])


                // navigation.navigate('Home', { item: { name: value, hasAavatar: true, localImage: avatarUri } })
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Home',
                      params: { item: { name: value, hasAvatar: true, localImage: avatarUri } },
                    },
                  ],
                })

               

              })
              : regUser(value).then(async (response) => {
                await createFolder(value)
                setForceDisable(false)
                setToken(response.headers["x-auth-token"])
                //  setInitialRouter("Home")

                AsyncStorage.setItem("token", response.headers["x-auth-token"])

                setPeopleList([{ name: value, hasAvatar: false, key: Math.random() }])




                //navigation.navigate('Home', { item: { name: value, hasAavatar: false } })
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Home',
                      params: { item: { name: value, hasAvatar: false } },
                    },
                  ],
                })







              })


          }
          else {
            alert(value + " is taken, use another")
            setForceDisable(false)
          }




        }}

      />
      <Button disabled={!value} title="Delete" raised={true} containerStyle={{ position: "absolute", top: height * 0.3 + 200, width: width * 0.8 }}

        onPress={function (e) {
          FileSystem.readDirectoryAsync("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cr7cr8%252Fnotes/ImagePicker/").then(data => {
            data.forEach(filename_ => {
              console.log(Date.now() + "=cached photo==***===" + filename_)
              FileSystem.deleteAsync("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cr7cr8%252Fnotes/ImagePicker/" + filename_, { idempotent: true })
            })

          })
        }}

      />


    </View>

  )

}


async function pickImage(value, setAvatarUri) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (!result.cancelled) {
    setAvatarUri(result.uri)

  }
};

function regUserWithAvatar(userName, avatarUri) {


  const localUri = avatarUri


  let match = /\.(\w+)$/.exec(localUri.split('/').pop());
  let type = match ? `image/${match[1]}` : `image`;
  let filename = userName

  const formData = new FormData();

  formData.append('file', { uri: localUri, name: filename, type });
  formData.append("obj", JSON.stringify({ ownerName: userName }))
  formData.append("userName", userName)


  return axios.post(`${url}/api/image/upload`, formData, { headers: { 'content-type': 'multipart/form-data' }, })
    .then(response => {

      //  FileSystem.deleteAsync(localUri, { idempotent: true })
      return response
    })

}

function regUser(userName) {

  return axios.post(`${url}/api/user/reguser`, { userName }).then(response => {
    return response
  })

}