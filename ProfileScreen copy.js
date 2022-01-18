import React, { useState, useRef, useEffect, useContext } from 'react';

const { compareAsc, format, formatDistanceToNow, } = require("date-fns");
const { zhCN } = require('date-fns/locale');


import * as FileSystem from 'expo-file-system';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration, TextInput
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


import url, { hexToRgbA, hexToRgbA2, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView } from "./config";
import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from "react-native-status-bar-height";



export function ProfileScreen({ navigation, route }) {
  const avatarString = multiavatar(route.params.item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  const bgColor2 = hexify(hexToRgbA2(avatarString.match(/#[a-zA-z0-9]*/)[0]))




  const titleBarHeight = (getStatusBarHeight() > 24) ? 70 : 60
  const item = route.params.item


  const { token, userName } = useContext(Context)


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
      opacity:withTiming(btnScale.value),
      elevation:5,
      //  backgroundColor:bgColor
    }

  })


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
              ? <Image source={{ uri: `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
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
          <Text style={{ fontSize: 20, textAlign: "center" }}>Introdu grge  jklreg  jlkgrjeigojigjero  jrlkge
            jioreg  poerpoe pore opgdpos opgdrlge493 ctiroduc ctiroduc  ctiroduc  ctiroduction to your self
            93 ctiroduc ctirod
            </Text>
        </ScrollView>

        <View style={{ width, height: 10 }}></View>


      </View >


      {/* <Divider style={{ height: 30 }} /> 
    ///////////////////////////////////////////
    ////////////////////////////////////////////
    ///////////////////////////////////////////
    /////////////////////////////////////////////
    //////////////////////////////////////////
    //////////////////////////////////////////////
    */}


      <View style={[inputFrameStyle]} onLayout={function (e) {


      //  console.log("frame layout height", e.nativeEvent.layout.height)

        if (inputHeight.value < 5) {
          inputHeight.value = e.nativeEvent.layout.height - 20

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
            return <TextInput style={{

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


      <View style={[submitBtnStyle]}>
        <Button title="Submit"
          type="solid"
         
          containerStyle={{ elevation:3, transform:[{translateY:-10}] ,}}
          //    containerStyle={{ backgroundColor: bgColor }}
             buttonStyle={{ backgroundColor: bgColor,  }}
          titleStyle={{
            color: bgColor2,

            fontSize: 20
          }}
          // iconRight
          // icon={{
          //   name:'send',
          //   type:'ionicon',
          //   size: 30,
          //   color: "white",
          // }}

          onPress={function () {
            //    inputHeight_.value = inputHeight_.value === 0 ? withTiming(inputHeight.value) : withTiming(0)
            //console.log("pressed")

          }} />

      </View>










      {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="create-outline" />
      </View>
      */}



      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="image-outline" onPress={function () {



         // console.log(inputHeight.value)
        }} />
        <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="camera-outline" />
        <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="chatbox-ellipses-outline" onPress={function () {

          btnScale.value = inputHeight_.value === 0 ? 1 : 0

          inputHeight_.value = inputHeight_.value === 0 ? withTiming(inputHeight.value) : withTiming(0)



        }} />
        <IconBtn bgColor={bgColor} bgColor2={bgColor2} iconName="trash-outline" />

      </View>











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