
import DraggableFlatList, {
  ScaleDecorator,
  useOnCellActiveAnimation,
  ShadowDecorator,

} from "react-native-draggable-flatlist";

import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';

const { compareAsc, format, formatDistanceToNow, } = require("date-fns");
const { zhCN } = require('date-fns/locale');

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';

import * as FileSystem from 'expo-file-system';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback, Vibration
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

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Badge } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';


import url, { hexToRgbA, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView } from "./config";
import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from "react-native-status-bar-height";


export function HomeScreen({ navigation, route }) {


  const { peopleList, setPeopleList, token, userName, initialRouter, setInitialRouter, unreadCountObj, setUnreadCountObj,

    chattingUser, setLatestMsgObj, latestChattingMsg }
    = useContext(Context)




  useEffect(function () {
    axios.get(`${url}/api/user/fetchuserlist`, { headers: { "x-auth-token": token } })
      .then(response => {

        if (initialRouter === "Reg") {
          let arr = response.data //.filter(item => { return item.name !== userName })
          HomeScreen.sharedElements = null


          // setPeopleList(pre => { return [...pre, ...arr.filter(item => { return item.name !== userName })] })

          setPeopleList(pre => {
            return uniqByKeepFirst([...pre, ...arr], function (item) { return item.name })
          })
          route.params && route.params.item.localImage && FileSystem.deleteAsync(route.params.item.localImage, { idempotent: true })


        }
        else if (initialRouter === "Home") {
          setPeopleList(pre => { return response.data })
          //console.log(response.data)
        }

        return response.data
      })

  }, [])

  useEffect(function () {

    const promiseArr = []
    peopleList.forEach((people, index) => {
      const sender = people.name
      const folderUri = FileSystem.documentDirectory + "UnreadFolder/" + sender + "/"
      promiseArr.push(FileSystem.readDirectoryAsync(folderUri).then(unreadArr => {
        return { [sender]: unreadArr.length }
      }))
    })

    Promise.all(promiseArr).then(objArr => {
      let obj = {}
      objArr.forEach(o => {
        obj = { ...obj, ...o }
      })
      setUnreadCountObj(obj)
    })





  }, [peopleList])




  const renderItem = ({ item, drag, isActive, index }) => {


    return (
      <ItemComponent item={item} drag={drag} isActive={isActive} index={index} />
    )


  };




  return (
    <>
      {/* <HoldItem /> */}
      <DraggableFlatList
        data={peopleList}
        //  onDragEnd={({ data }) => setData(data)}

        onDragEnd={function ({ data }) {

          axios.post(`${url}/api/user/resortuserlist`, data.map(item => item.name), { headers: { "x-auth-token": token } })

          setPeopleList(data)
        }}


        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />

    </>
  );
}

function ItemComponent({ isActive, drag, item, index, ...props }) {

  const navigation = useNavigation()
  const { peopleList, randomStr, setPeopleList, token, userName, initialRouter, setInitialRouter, unreadCountObj, setUnreadCountObj, chattingUser, setLatestMsgObj, latestChattingMsg }
    = useContext(Context)



  const avatarString = multiavatar(item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))


  const isRendered = useRef(false)


  const baseColor = useSharedValue("white")


  const baseScale = useDerivedValue(() => { return isActive ? 0.8 : 1 })




  const baseTranslateX_ = useDerivedValue(() => {
    const temp = (height - 60) / 80
    const amountCanList = Number(temp.toFixed(0)) + 1

    if ((initialRouter === "Reg") && (index === 0)) {
      return 0
    }
    else if (isRendered.current) {
      return 0
    }
    else if (index <= amountCanList) {
      return width
    }
    else {
      return 0
    }
  })

  const baseTranslateX = useDerivedValue(() => {
    return baseTranslateX_.value
  })



  const duration = useDerivedValue(() => {
    const temp = (height - 60) / 80
    const amountCanList = Number(temp.toFixed(0)) + 1

    if ((initialRouter === "Reg") && (index === 0)) {
      return 0
    }
    else if (isRendered.current) {
      return 0
    }
    else if (index > amountCanList) {
      return 0
    }
    else {
      return (index % amountCanList) * 100
    }



  })





  const baseStyle = useAnimatedStyle(() => {

    return {
      height: 80, width,
      backgroundColor: baseColor.value,

      borderBottomWidth: 1,
      borderBottomColor: "#DDD",
      transform: [
        { scale: withTiming(baseScale.value) },

        { translateX: withTiming(baseTranslateX.value, { duration: duration.value }) },
        //{ translateX: withTiming(5, { duration: duration.value }) }
      ],
      // overflow:"hidden",

    }
  })

  const backOpacity = useDerivedValue(() => {

    // if (isActive) { return 1 }
    // else {
    //   return withTiming(interpolate(baseTranslateX.value, [width, 0], [1, 0]))
    // }

    return isActive ? 1 : 0


  })


  const backViewStyle = useAnimatedStyle(() => {

    return {
      height: 80, width,
      backgroundColor: bgColor,
      ...isActive && { elevation: 5 },
      position: "absolute",
      borderBottomWidth: 1,
      borderBottomColor: "#DDD",
      flexDirection: "row",
      alignItem: "center",
      justifyContent: "flex-end",

      top: 0,
      left: 0,
      zIndex: 50,


      opacity: withTiming(backOpacity.value, { duration: 500 }),
    }
  })




  const frontStyle = useAnimatedStyle(() => {

    return {
      height: 80, width,
      backgroundColor: "transparent",
      ...isActive && { elevation: 10 },
      position: "absolute",
      borderBottomWidth: 1,
      borderBottomColor: "#DDD",

      top: 0,
      left: 0,
      zIndex: 100,

      display: "flex",
      flexDirection: "row",
      alignItem: "center"

    }
  })



  return (

    <Pressable
      onPress={function () {

        if (item.name !== "AllUser") {
          navigation.navigate('Chat', { item: item })
        }
        else if (item.name === "AllUser") {
          navigation.navigate('ChatAll', { item: item, peopleList: peopleList })
        }
      }}

      onPressIn={function () {
        baseColor.value = bgColor
      }}
      onPressOut={function () {
        baseColor.value = "white"
      }}

      onLongPress={drag}
      disabled={isActive}
    >



      <View style={[baseStyle]} onLayout={function () {
        isRendered.current = true
        baseTranslateX.value = 0

      }}>

        <View style={[backViewStyle]} >
          <Icon
            containerStyle={{ alignItem: "center", justifyContent: "center" }}
            name="drag-vertical"
            type='material-community'
            color='#517fa4'
            size={50}
          />
        </View>

        <View style={[frontStyle]} >

          <Badge
            value={unreadCountObj[item.name] || 0}
            status="error"
            containerStyle={{
              position: 'absolute', top: 10, left: 58, zIndex: 100,
              transform: [{ scale: Boolean(unreadCountObj[item.name]) ? 1.2 : 0 }],
              display: "flex", justifyContent: "center", alignItems: "center"
            }}
            badgeStyle={{
              //     color: "blue",
              //      position: 'absolute', top: 10, left: 60, zIndex: 100,
              //      backgroundColor:"yellow",
              // transform: [{ scale: 1.8 }],
              display: "flex", justifyContent: "center", alignItems: "center"
            }}
            textStyle={{
              transform: [{ translateY: -2 }],
            }}
          />



          <Pressable
            onPress={function () {
              navigation.navigate('Profile', { item: item })
            }}
            onPressIn={function () {
              baseColor.value = bgColor
            }}
            onPressOut={function () {
              baseColor.value = "white"
            }}

          >
            {item.name !== "AllUser" && <SharedElement id={item.name}  >
              {item.hasAvatar
                ? <Image source={{ uri: item.localImage || `${url}/api/image/avatar/${item.name}?${item.randomStr}` }} resizeMode="cover"
                  style={{ margin: 10, width: 60, height: 60, borderRadius: 1000 }}


                />
                : <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
              }
            </SharedElement>}

            {item.name === "AllUser" &&

              < Image source={{ uri: item.localImage || `${url}/api/image/avatar/${item.name}?${item.randomStr}` }} resizeMode="cover"
                style={{ margin: 10, width: 60, height: 60, borderRadius: 1000 }}
              />


            }

          </Pressable>
          <NameText item={item} />
        </View>
      </View>
    </Pressable >

  );



}

function NameText({ item, ...props }) {


  const { token, latestMsgObj, setLatestMsgObj, userName, latestChattingMsg, initialRouter } = useContext(Context)




  const [textToShow, setTextToShow] = useState("")
  const [textDate, setTextDate] = useState("")

  const navigation = useNavigation()

  const unsubscribe1 = navigation.addListener('focus', () => {

    if (latestChattingMsg.current) {
      const obj = latestChattingMsg.current
      //   latestChattingMsg.current = ""

      const sender = obj.sender === userName ? obj.toPerson : obj.sender
      let objText = ""
      if (obj.audio) {
        objText = "[audio]"
      }
      else if (obj.image) {
        objText = "[image]"
      }
      else if (obj.text) {
        objText = obj.text
      }
      if (obj.sender === userName) { objText = "\u2b05 " + objText }

      if ((sender === item.name) && (textToShow !== objText)) {

        //    setTextToShow(objText)

        // const aaa = ((Date.now() - Date.parse(obj.createdAt)) >= 1000 * 60 * 60 * 24)
        //   ? new Date(obj.createdAt).toLocaleString().substring(4, 10)
        //   : new Date(obj.createdAt).toLocaleString().substring(11, 16)

        //    setTextDate(" " + aaa)
        setLatestMsgObj(pre => {

          return { ...pre, [sender]: { content: objText, saidTime: obj.createdAt } }

        })
        latestChattingMsg.current = ""

      }

    }


    return unsubscribe1

  }, [navigation])



  useEffect(function () {

    //if ((latestMsgObj[item.name]) && (latestMsgObj[item.name] !== textToShow)) {
    if ((latestMsgObj[item.name])) {




      setTextToShow(latestMsgObj[item.name].content)

      const saidTime = Date.parse(latestMsgObj[item.name].saidTime)



      const aaa = ((Date.now() - saidTime) >= (1000 * 60 * 60 * 24))
        ? new Date(saidTime).toLocaleString().substring(4, 10)
        : new Date(saidTime).toLocaleString().substring(11, 16)



      setTextDate(" " + aaa)





    }

  }, [latestMsgObj])



  useEffect(async function () {
    if (!latestMsgObj[item.name]) {

      const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"

      let lastName = ""
      FileSystem.readDirectoryAsync(folderUri).then(msgNameArr => {

        msgNameArr.sort()
        lastName = msgNameArr.pop()

        if (lastName) {
          FileSystem.readAsStringAsync(folderUri + lastName).then(data => {

            const obj = JSON.parse(data)

            let objText = ""

            if (obj.audio) {
              objText = "[audio]"
            }
            else if (obj.image) {
              objText = "[image]"
            }
            else if (obj.text) {
              objText = obj.text
            }

            if (obj.sender === userName) { objText = "\u2b05 " + objText; }
            else if (item.name === "AllUser") {
              objText = obj.sender + ": " + objText;
            }

            setTextToShow(objText)


            const aaa = ((Date.now() - Date.parse(obj.createdAt)) >= (1000 * 60 * 60 * 24))
              ? new Date(obj.createdAt).toLocaleString().substring(4, 10)
              : new Date(obj.createdAt).toLocaleString().substring(11, 16)

            setTextDate(" " + aaa)

            //setTextDate(" "+formatDistanceToNow(new Date(obj.createdAt)).replace("about","").replace( " hours","h").replace(" minutes","m"))
          })

        }
      })
    }

  }, [])


  return (
    <View style={{ justifyContent: "center" }}>

      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 20, }}>{item.name}</Text>
        <Text style={{ fontSize: 15, color: "#a0a0a0" }}>{textDate}</Text>
      </View>

      {Boolean(textToShow) && <Text style={{ fontSize: 18, color: "#666", lineHeight: 20, width: width - 100, overflow: "hidden" }} ellipsizeMode='tail' numberOfLines={1} >
        {textToShow}
      </Text>}
    </View>
  )

}










HomeScreen.sharedElements = (route, otherRoute, showing) => {

  // console.log("====+++",route)
  return route.params && route.params.item && route.params.item.name && [
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", }, // ...messageArr,   // turn back image transition off
  ]
};