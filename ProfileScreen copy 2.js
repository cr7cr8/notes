import React, { useState, useRef, useEffect, useContext } from 'react';

const { compareAsc, format, formatDistanceToNow, } = require("date-fns");
const { zhCN } = require('date-fns/locale');


import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, TextInput, Alert,
} from 'react-native';

import ReAnimated, {
  useAnimatedStyle, useSharedValue, useDerivedValue,
  withTiming, cancelAnimation, runOnUI, useAnimatedReaction, runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  withDelay,
  withSpring,
  useAnimatedScrollHandler,

  //interpolateColors,

  useAnimatedProps,
  withSequence,
  withDecay,


} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, Image, ScrollView: ScrollV, Extrapolate } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Badge, Switch, Input, Divider } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';


import url, { hexToRgbA, hexToRgbA2, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView, deleteFolder, createFolder } from "./config";
import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from "react-native-status-bar-height";


import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';





import { CommonActions } from '@react-navigation/native';

const insertBeforeLast = (routeName, params) => (state) => {
  const routes = [
    ...state.routes.slice(0, -1),
    { name: routeName, params },
    state.routes[state.routes.length - 1],
  ];

  return CommonActions.reset({
    ...state,
    routes,
    index: routes.length - 1,
  });
};



export function ProfileScreen({ navigation, route }) {
  const avatarString = multiavatar(route.params.item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  const bgColor2 = hexify(hexToRgbA2(avatarString.match(/#[a-zA-z0-9]*/)[0]))






  const titleBarHeight = (getStatusBarHeight() > 24) ? 70 : 60
  const item = route.params.item


  const { token, userName, setSnackMsg, setSnackBarHeight } = useContext(Context)

  const [description, setDescription] = useState("")
  const inputText = useRef("")

  const inputRef = useRef()
  const inputHeight = useSharedValue(1)
  const inputHeight_ = useSharedValue(0)



  const inputFrameStyle = useAnimatedStyle(() => {

    if (inputHeight.value === 1) {
      return {
        width, backgroundColor: "brown", position: "relative",
        overFlow: "hidden",
        opacity: 1,
      }
    }
    else {
      return {
        width, backgroundColor: "brown", position: "relative",
        height: inputHeight_.value, //withTiming(inputHeight_.value),
        overFlow: "hidden",
        opacity: 1,
      }
    }


  }, [inputHeight_.value])

  //const pressViewOpacity = useSharedValue(0)

  const pressViewStyle = useAnimatedStyle(() => {

    return {
      height: inputHeight_.value,
      width, backgroundColor: "orange",
      opacity: 0,
      zIndex: 1000,
      position: "absolute",
      top: 0, left: 0
    }


  })

  const btnScale = useSharedValue(0)
  const submitBtnStyle = useAnimatedStyle(() => {


    return {

      width,
      height: 70,
      transform: [{ scale: withTiming(btnScale.value) }],
      overFlow: "hidden",
      opacity: withTiming(btnScale.value),
      elevation: 5,
      //  backgroundColor:bgColor
    }

  })


  const btnElevation = useSharedValue(3)
  const deleteBtnStyle = useAnimatedStyle(() => {




    return {
      elevation: withTiming(btnElevation.value),
      position: "absolute", bottom: 30, alignSelf: "center",
      width: width - 30,
      height: 50,
      backgroundColor: bgColor,
      transform: [{ scale: withTiming(Math.abs(btnScale.value - 1)) }]

      // ...btnScale.value !== 0 && { display: "none" },
    }


  })


  const [numberOfFiles, setNumberOfFiles] = useState(0)
  const btnMessage = `Hold to delete ${numberOfFiles} messages`
  useEffect(function () {

    const name = item.name

    axios.get(`${url}/api/user/getdescription/${item.name}`, { headers: { "x-auth-token": token } }).then(response => {

      // console.log(response.data)
      setDescription(response.data)

    })


    // FileSystem.getInfoAsync(FileSystem.documentDirectory + "MessageFolder/" + name + "/")
    // .then((obj) => {
    // console.log(obj)
    // })





  }, [])






  const alertMessage = `Sure to delete ${item.name}'s messages ?`



  const [avatar, setAvatar] = useState("")


  return (

    <>
      <View style={{
        alignItems: "center", justifyContent: "center", flexDirection: "column", backgroundColor: bgColor, padding: 0,
        elevation: 5,


        position: "relative",
        height: height * 0.25,

      }}>

        <Pressable onPress={function () {

          //console.log(item.hasAvatar)
          const _id = Math.random()

          navigation.navigate('Image', {
            item: { name: item.name, hasAvatar: item.hasAvatar },
            imagePos: 0,

            messages: [
              item.hasAvatar
                ? { image: `${url}/api/image/avatar/${item.name}`, width: 60, height: 60, }
                : { image: "", isSvg: true }
            ],


            setMessages: "",
          })

        }}>


          {item.name !== "AllUser" && <SharedElement id={item.name} style={{ transform: [{ scale: 1 }], alignItems: "center", justifyContent: "center", }}   >
            {item.hasAvatar
              ? <Image source={{ uri: avatar || `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
                style={{
                  position: "relative",
                  //  top: getStatusBarHeight(),
                  width: 100, height: 100, borderRadius: 1000
                }} />
              : <SvgUri style={{ position: "relative", /*top: getStatusBarHeight() */ }} width={100} height={100} svgXmlData={multiavatar(item.name)} />
            }
          </SharedElement>
          }
          {item.name === "AllUser" &&

            < Image source={{ uri: item.localImage || `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
              style={{ width: 100, height: 100, borderRadius: 1000 }}
            />


          }

        </Pressable>

        <View style={{ width, height: 10 }}></View>
        <ScrollView contentContainerStyle={{
          paddingHorizontal: 8, width, flexWrap: "nowrap", backgroundColor: bgColor,
          //   height: 200
        }}


        >
          <Text style={{ fontSize: 20, textAlign: "center" }}>{description}
          </Text>
        </ScrollView>

        <View style={{ width, height: 10 }}></View>


      </View >


      {/*
    ///////////////////////////////////////////
    ////////////////////////////////////////////
    ///////////////////////////////////////////
    /////////////////////////////////////////////
    //////////////////////////////////////////
    //////////////////////////////////////////////
    */}


      {item.name === userName && <View style={[inputFrameStyle]} onLayout={function (e) {


        //  console.log("frame layout height", e.nativeEvent.layout.height)

        if (inputHeight.value < 5) {
          inputHeight.value = e.nativeEvent.layout.height - 20

          //inputHeight.value = 140
          setImmediate(function () {
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "MessageFolder/" + item.name + "/")
              .then((arr) => {
                setNumberOfFiles(arr.length)
              })
          })


        }


      }}>

        <View style={[pressViewStyle]} >
          <Pressable
            style={{ width: width, height: "90%" }}
            onPress={function () {

              // console.log(Date.now())
              inputRef.current.blur()
              inputRef.current.focus()

            }} />


        </View>


        <Input


          InputComponent={React.forwardRef(function () {
            return <TextInput

              //    value={description}

              onChangeText={function (text) {
                //  setDescription(text)
                inputText.current = text
              }}

              placeholder="Enter description here..."
              style={{

                //  backgroundColor: "skyblue", width: "100%", lineHeight: 40, fontSize: 20, textAlignVertical: 'top',

                marginVertical: 0,
                backgroundColor: "white",
                width, lineHeight: 20, fontSize: 20, textAlignVertical: 'top', paddingHorizontal: 8,
                transform: [{ translateY: 20 }],
                height: "100%",


              }}

              numberOfLines={3}
              multiline={true}
              ref={inputRef}

            />
          })}


          // numberOfLines={3}
          // multiline={true}
          //ref={inputRef}

          onLayout={function (e) {

            //  console.log("input layout height", e.nativeEvent.layout.height)

            // if (inputHeight.value < 5) {
            //   inputHeight.value = e.nativeEvent.layout.height 

            // }


          }}
          placeholder='BASIC INPUT'
          containerStyle={{
            backgroundColor: bgColor,
            padding: 0, elevation: 5,
            width,
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            overFlow: "hidden",
            //   height: "100%",
            paddingVertical: 0,
            // position:"absolute",
            // top:0,
            // left:0,
          }}
          inputContainerStyle={{
            //transform: [{ translateY: 18 }],
            backgroundColor: "transparent",
            overFlow: "hidden",
            width,
            display: "flex", alignItems: "center", justifyContent: "flex-end",

            elevation: 0,
          }}
        // inputStyle={{

        //   marginVertical: 0,
        //   backgroundColor: "white",
        //   width, lineHeight: 20, fontSize: 20, textAlignVertical: 'top', paddingHorizontal: 8,
        //   transform: [{ translateY: 20 }],
        //   height: "100%",
        // }}

        />




      </View>

      }

      {item.name === userName &&
        <View style={[submitBtnStyle]}>
          <Button title="Submit"
            type="solid"

            containerStyle={{ elevation: 3, transform: [{ translateY: -10 }], }}
            //    containerStyle={{ backgroundColor: bgColor }}
            buttonStyle={{ backgroundColor: bgColor, }}
            titleStyle={{
              color: bgColor2,

              fontSize: 20
            }}

            onPress={function () {

              //    console.log(",,,", inputText.length, Date.now())

              // console.log(Object.keys(inputRef.current))
              //  console.log(inputText.current)

              axios.post(`${url}/api/user/updatedescription`, { description: inputText.current }, { headers: { "x-auth-token": token } }).then(response => {

                setTimeout(() => {
                  setDescription(inputText.current)
                }, 500);


                btnScale.value = 0
                inputHeight_.value = withTiming(0)

              })

            }} />

        </View>
      }



      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        {item.name === userName && <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="image-outline" onPress={function () {


          pickImage(item, setAvatar)
          // console.log(inputHeight.value)
        }} />}


        {item.name === userName && <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="chatbox-ellipses-outline" onPress={function () {

          btnScale.value = inputHeight_.value === 0 ? 1 : 0
          inputHeight_.value = inputHeight_.value === 0 ? withTiming(inputHeight.value) : withTiming(0)

        }} />}

        {item.name === userName && <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="camera-outline" onPress={function () {



          // console.log(inputHeight.value)
        }} />}




      </View>


      {numberOfFiles !== 0 && <View style={[deleteBtnStyle]}>
        <Button title={btnMessage}
          type="clear"

          containerStyle={{}}

          buttonStyle={{ backgroundColor: bgColor, }}
          icon={{
            name: 'trash-outline',
            type: 'ionicon',
            size: 30,
            color: bgColor2,
          }}

          titleStyle={{
            color: bgColor2,

            fontSize: 15
          }}

          onPressIn={function () {
            btnElevation.value = 0
          }}

          onPressOut={function () {
            btnElevation.value = 3
          }}



          onLongPress={function () {



            Alert.alert("Confirm", alertMessage,
              [{
                text: "Cancel",
                onPress: () => { },
                style: "cancel"
              },
              {
                text: "YES",
                onPress: async () => {

                  await deleteFolder(item.name)
                  await createFolder(item.name)
                  setSnackMsg("Deleted")
                  setSnackBarHeight(60)
                  setNumberOfFiles(0)

                  navigation.dispatch((state) => {
                    return CommonActions.reset({
                      ...state,
                      routes: state.routes.map(route => {
                       
                        return route.name === "Chat"
                          ? { ...route, key: "Chat-" + route.key.replace("Chat-","").split("").reverse().join("") }
                          : route
                      }),
                      index: state.routes.length - 1,
                    });
                  });

                  //BackHandler.exitApp()
                }


              }]);
            return true
          }}


          onPress={function () {

            console.log("fsd")



          }}


        />
      </View>
      }

    </>

  )


}






ProfileScreen.sharedElements = (route, otherRoute, showing) => {

  let messageArr = []
  // if (otherRoute && otherRoute.route && otherRoute.route.params && otherRoute.route.params.messages) {
  //   messageArr = otherRoute.route.params.messages.map(item => {
  //     return { id: item._id, animation: "move", resize: "auto", align: "left" }
  //   })

  // }

  return [
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },
    // ...messageArr,   // turn back shared image transition off
  ]
};


function IconBtn({ bgColor, bgColor2, onPress = () => { }, iconName = "image-outline", iconType = "ionicon", ...props }) {

  const elevation = useSharedValue(5)
  const viewStyle = useAnimatedStyle(() => {

    return {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: bgColor,
      borderRadius: 1000,
      width: 80, height: 80,
      elevation: withTiming(elevation.value, { duration: 200 })

    }

  })


  return <View style={[viewStyle]}>
    <Icon
      onPress={onPress}

      onPressIn={() => {
        elevation.value = 0
      }}
      onPressOut={() => {
        elevation.value = 5
      }}

      name={iconName}
      type={iconType}
      color={bgColor2}
      size={50}
      containerStyle={{

        width: 80, height: 80,
        justifyContent: "center",
        alignItems: "center",

      }}
    />
  </View>


}



async function pickImage(item, setAvatar) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (!result.cancelled) {

    console.log(result.uri)
    // item.hasAvatar = true
    //setAvatar(result.uri)


  }
};