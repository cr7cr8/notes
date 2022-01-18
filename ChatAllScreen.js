import React, { useState, useRef, useEffect, useContext, useCallback, useMemo } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';
import * as Device from 'expo-device';
import axios from 'axios';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, UIManager, findNodeHandle,

  SafeAreaView,
  KeyboardAvoidingView,
  BackHandler,
  Alert
} from 'react-native';

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
  measure,
  useAnimatedRef,
  withRepeat,
  Easing,

} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, Image: ImageV, ScrollView: ScrollV, } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';
import useKeyboardHeight from 'react-native-use-keyboard-height';
//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button, Tooltip, Icon, Input } from 'react-native-elements'




import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';


import { SharedElement } from 'react-navigation-shared-element';

import { getStatusBarHeight } from 'react-native-status-bar-height';
const { width, height } = Dimensions.get('screen');
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = getStatusBarHeight();
const BOTTOM_HEIGHT = Math.max(0, height - WINDOW_HEIGHT - STATUS_HEIGHT);
//console.log("-------------------", height, STATUS_HEIGHT, WINDOW_HEIGHT, BOTTOM_HEIGHT)


import { Context } from "./ContextProvider"

import {
  GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer, MessageImage,
  Actions,


} from 'react-native-gifted-chat'
import { Video, AVPlaybackStatus, Audio, ExponentAV } from 'expo-av';

import Image from 'react-native-scalable-image';

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { OverlayDownloader } from "./OverlayDownloader";
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';




//import Snackbar from 'expo-snackbar';
//import SnackBar from 'react-native-snackbar-component';

import SnackBar, { SnackContext } from "./SnackBar";

import jwtDecode from 'jwt-decode';

import url, { hexToRgbA, hexToRgbA2, hexify, uniqByKeepFirst, ScaleView } from "./config";
import { Path } from 'react-native-svg';














let recording = new Audio.Recording();
let audioSound = new Audio.Sound();

export function ChatAllScreen({ navigation, route, ...props }) {


  const [isOverLay, setIsOverLay] = useState(false)


  const { peopleList, token, userName, socket, setSnackBarHeight, setSnackMsg, appState, unreadCountObj, setUnreadCountObj, latestMsgObj, latestChattingMsg,


    setLatestMsgObj } = useContext(Context)




  useMemo(function () {

    ChatAllScreen.sharedElements = (route, otherRoute, showing) => {



      return peopleList.map(people => {
        return {
          id: people.name,
          animation: "move", resize: "auto", align: "left",
        }

      })

    }

  }, [peopleList])








  const item = peopleList.find(people => { return people.name === route.params.item.name })
  // const item = route.params.item
  // let peopleList = route.params.peopleList


  //console.log(item)
  // console.log(Device.hasNotch())



  const titleBarHeight = (getStatusBarHeight() > 24) ? 70 : 60
  let keyboardHeight = useKeyboardHeight();
  if (keyboardHeight > 0 && getStatusBarHeight() > 24) {
    keyboardHeight = keyboardHeight + getStatusBarHeight()
  }

  //console.log(getStatusBarHeight(), Device.deviceName, titleBarHeight)

  const avatarString = multiavatar(item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  const bgColor2 = hexify(hexToRgbA2(avatarString.match(/#[a-zA-z0-9]*/)[0]))


  const [shouldDisplayNotice, setShouldDisplayNotice] = useState(true)
  const canMoveDown = useRef(true)

  const [messages, setMessages] = useState([])

  const previousMessages = useRef([])

  const scrollRef = useRef()

  const inputRef = useRef()

  const inputText = useRef("")

  const expandWidth = useSharedValue(50)

  const keyboardHeightRef = useRef(0)
  if (keyboardHeightRef.current === 0 && (keyboardHeight > 0)) {
    keyboardHeightRef.current = keyboardHeight
  }

  const totalBlockHeight = useRef(0)




  //display message
  useEffect(function () {

    socket.on("displayRoomMessage", function (msgArr) {

      canMoveDown.current = true
      let msgArr_ = msgArr.map(msg => {



        const sender = peopleList.find(people => { return people.name === msg.sender })
        const avatarString = multiavatar(sender.name)
        const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))


        latestChattingMsg.current = { ...msg, sender: "AllUser", text: sender.name + ": " + msg.text }

        return {
          ...msg,
          bgColor,
          user: {
            _id: msg.sender + "---" + Math.random(),
            avatar: () => {
              return sender.hasAvatar
                ? <ImageV source={{ uri: `${url}/api/image/avatar/${sender.name}?${sender.randomStr}` }} resizeMode="cover"
                  style={{
                    position: "relative",

                    width: 36, height: 36, borderRadius: 1000
                  }} />
                : <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(sender.name)} />

            }
          }
        }

      })



      setMessages(pre => {

        msgArr_ = uniqByKeepFirst([...pre, ...msgArr_], function (msg) { return msg._id })
        //   return [...msgArr_]

        if (msgArr_.length >= 20) {
          previousMessages.current = previousMessages.current.concat(msgArr_.slice(0, msgArr_.length - 10))
          if (!shouldDisplayNotice) { setShouldDisplayNotice(true) }

          return msgArr_.slice(-10)
        }
        else {

          return msgArr_
        }
      })

    })


    return function () {
      socket.off("displayRoomMessage")
    }
  }, [peopleList])

  //initalizing message container
  useEffect(async function () {



    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"


    FileSystem.readDirectoryAsync(folderUri).then(data => {
      const promiseArr = []
      //      console.log(data.length)

      data.forEach(msgFile => {
        //  console.log(msgFile)

        promiseArr.push(FileSystem.readAsStringAsync(folderUri + msgFile).then(content => {
          const msg = JSON.parse(content)
          const isLocal = Boolean(msg.isLocal)


          let sender = peopleList.find(people => { return people.name === msg.sender })
          if (!sender) { sender = {}; sender.hasAvatar = false }


          const avatarString = multiavatar(msg.sender)
          const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))

          msg.bgColor = bgColor

          msg.user.avatar = () => {
            return sender.hasAvatar
              ? <ImageV source={{ uri: `${url}/api/image/avatar/${msg.sender}?${sender.randomStr}` }} resizeMode="cover"
                style={{
                  position: "relative",

                  width: 36, height: 36, borderRadius: 1000
                }} />
              : <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(isLocal ? userName : msg.sender, false)} />

          }
          msg.user._id = isLocal ? userName : msg.user._id + "---" + Math.random()

          return msg
        })
        )
      })


      Promise.all(promiseArr)
        .then(msgArr => {

          //  console.log(msgArr)

          previousMessages.current = uniqByKeepFirst([...msgArr, ...messages], function (msg) { return msg._id }).sort(function (msg1, msg2) {
            return msg1.createdTime - msg2.createdTime
          })

          const msg10 = previousMessages.current.pop()
          const msg9 = previousMessages.current.pop()
          const msg8 = previousMessages.current.pop()
          const msg7 = previousMessages.current.pop()
          const msg6 = previousMessages.current.pop()
          const msg5 = previousMessages.current.pop()
          const msg4 = previousMessages.current.pop()
          const msg3 = previousMessages.current.pop()
          const msg2 = previousMessages.current.pop()
          const msg1 = previousMessages.current.pop()

          let preMessagesArr = [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10]
          preMessagesArr = preMessagesArr.filter(function (item) { return Boolean(item) })

          if (preMessagesArr.length > 0) {
            const msgArr_ = uniqByKeepFirst([...preMessagesArr, ...messages], function (msg) { return msg._id })

            // console.log(msgArr_)

            setMessages(pre => {
              return msgArr_
            })
          }
          if (previousMessages.current.length === 0) { setShouldDisplayNotice(false) }


        })
        .then(async function () {
          const folderUri = FileSystem.documentDirectory + "UnreadFolder/" + item.name + "/"
          await FileSystem.deleteAsync(folderUri, { idempotent: true })
          await FileSystem.makeDirectoryAsync(folderUri)

          setUnreadCountObj(pre => {
            return { ...pre, [item.name]: 0 }
          })
        })

    })

  }, [])


  //keyboard event to scroll to end
  useEffect(function () {

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', function (e) {

      setTimeout(() => {
        //scrollRef.current.scrollToEnd()
        //inputRef.current.blur()
        scrollRef.current.scrollToOffset({ offset: 9999, animated: true })
      }, 0);


    });

    return function () {

      keyboardDidShowListener.remove()
    }

  }, [])



  const scrollY = useSharedValue(0)



  const inputHeight = useSharedValue(0)

  useEffect(function () {

    // console.log(inputHeight.value)
    scrollRef.current && setTimeout(() => {
      scrollRef.current.scrollToOffset({ offset: 9999, animated: true })
    }, 0);
  }, [inputHeight.value])



  const micBarWidth = useSharedValue(0)
  const micBarStyle = useAnimatedStyle(() => {

    return {
      width: withTiming(micBarWidth.value, { duration: 100 }),

      //  width: withRepeat(withTiming(micBarWidth.value, { duration: 1000 }), -1, true),

      height: 60,
      backgroundColor: bgColor,
      position: "absolute",
      left: 60,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",

      // flexDirection: "row"
      // display:"relative",
    }
  })

  const isReleased = useSharedValue(1)
  const releasedStyle = useAnimatedStyle(() => {
    return {
      display: isReleased.value === 1 ? "flex" : "none",
      color: "#666",
      fontSize: 20,
    }
  })

  const onHoldStyle = useAnimatedStyle(() => {

    return {
      display: isReleased.value === 1 ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center"
      //    color: "#666",
    }

  })




  const inputBottomStyle = useAnimatedStyle(() => {

    return {
      height: withTiming(inputHeight.value, { duration: 100 }),


      backgroundColor: bgColor,
      // position: "absolute",
      // bottom: 0,
      //position:"absolute",
      //bottom:60,
      //left:0,
      width,
      opacity: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      // overflow: "hidden"
    }

  })




  const sendBtnWidth = useSharedValue(0)




  const backGesture = useAnimatedGestureHandler({


    onStart: (event, obj) => {
      isReleased.value = 0
      obj.translationX = event.translationX
      obj.translationY = event.translationY

      runOnJS(callStartRecording)()

    },
    onActive: (event, obj) => {
      isReleased.value = 0
      obj.translationX = event.translationX
      obj.translationY = event.translationY

      //console.log(event.translationX)

    },
    onEnd: (event, obj) => {
      obj.translationX = event.translationX
      obj.translationY = event.translationY




    },
    onFail: (event, obj) => {
      obj.translationX = event.translationX
      obj.translationY = event.translationY

      console.log("gesture fail")
    },
    onCancel: (event, obj) => {
      obj.translationX = event.translationX
      obj.translationY = event.translationY


      console.log("gesture cancel")


    },
    onFinish: (event, obj) => {

      if ((obj.translationY < -60) && (isReleased.value === 0)) {
        runOnJS(callCancelRecording)()
      }
      else if ((obj.translationX < -60) && (isReleased.value === 0)) {
        runOnJS(callCancelRecording)()
        micBarWidth.value = 0
      }
      else if ((obj.translationY >= -60) && (isReleased.value === 0)) {
        runOnJS(callStopRecording)()
      }


      isReleased.value = 1
    }

  })


  function callStartRecording() {
    startRecording({ messages, setMessages, userName, item, previousMessages, canMoveDown, shouldDisplayNotice, setShouldDisplayNotice })
  }

  function callStopRecording() {
    stopRecording({ messages, setMessages, userName, item, previousMessages, canMoveDown, shouldDisplayNotice, setShouldDisplayNotice, socket, latestChattingMsg })
  }

  function callCancelRecording() {
    cancelRecording(recording)
  }






  return (

    <>


      <Pressable
        onPress={function () {



          navigation.navigate('Profile', {
            item: { name: item.name, hasAvatar: item.hasAvatar },
            imagePos: 0,

            messages: [
              { image: `${url}/api/image/avatar/${item.name}?${item.randomStr}`, width: 60, height: 60, }

            ],
          })



        }}
      >


        <View style={{
          alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: bgColor, padding: 0, elevation: 1, position: "relative",
          height: titleBarHeight,

        }}>

          {/* <SharedElement id={item.name} style={{ transform: [{ scale: 0.56 }],alignItems: "center", justifyContent: "center", }}   >
          {item.hasAvatar
            ? <ImageV source={{ uri: `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
              style={{
                position: "relative",
                top: getStatusBarHeight(),
                width: 60, height: 60, borderRadius: 1000
              }} />
            : <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
          }
        </SharedElement> */}

          {peopleList.map(people => {

            return (
              <SharedElement
                key={people.name}
                id={people.name} style={{ transform: [{ scale: 0 }], position: "absolute", alignItems: "center", justifyContent: "center", }}   >
                {people.hasAvatar
                  ? <ImageV source={{ uri: `${url}/api/image/avatar/${people.name}/${people.randomStr}` }} resizeMode="cover"
                    style={{
                      position: "relative",
                      top: getStatusBarHeight(),
                      width: 60, height: 60, borderRadius: 1000
                    }} />
                  : <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={multiavatar(people.name)} />
                }
              </SharedElement>
            )
          })}





          <Text style={{ position: "relative", fontSize: 20, top: getStatusBarHeight() / 2 }}>{item.name}</Text>
        </View >
      </Pressable>




      {/* <View style={[bodyStyle]} > */}
      <GiftedChat

        renderCustomView={function ({ currentMessage, ...props }) {

          if (currentMessage.sender === userName) { return <></> }

          return <Text style={{ color: "#A0A0A0", textAlign: "left", marginHorizontal: 8 }}>{currentMessage.sender}</Text>
        }}

        listViewProps={{
          ref: (element) => { scrollRef.current = element },
          onScroll: function (e) {
            //   scrollY.value = e.nativeEvent.contentOffset.y

            // if (e.nativeEvent.contentOffset.y < scrollY.value) {
            //   inputHeight.value = 0
            // }
            inputHeight.value = 0
            scrollY.value = e.nativeEvent.contentOffset.y

            if (e.nativeEvent.contentOffset.y === 0) {

              if (previousMessages.current.length === 0) {

                shouldDisplayNotice && setSnackMsg("All messages are displayed")
                shouldDisplayNotice && setSnackBarHeight(60)
                setShouldDisplayNotice(false)

              }
              else {
                const msg5 = previousMessages.current.pop()
                const msg4 = previousMessages.current.pop()
                const msg3 = previousMessages.current.pop()
                const msg2 = previousMessages.current.pop()
                const msg1 = previousMessages.current.pop()

                const preMessagesArr = [msg1, msg2, msg3, msg4, msg5].filter(function (item) { return Boolean(item) })

                if (preMessagesArr.length > 0) { canMoveDown.current = false; setMessages(pre => { return [...preMessagesArr, ...pre] }) }

              }
            }

          },
          onLayout: function (e) {

            //   console.log(e.nativeEvent)

          },
          onContentSizeChange: (e) => {
            //   scrollRef.current.scrollToEnd({ animated: true })

            // console.log(e.nativeEvent)
            // console.log(totalBlockHeight.current)
            if (canMoveDown.current) {
              scrollRef.current.scrollToOffset({ offset: 9999, animated: true })

            }


          }
        }}

        // bottomOffset={300}
        // minInputToolbarHeight={60}
        renderUsernameOnMessage={false}
        scrollToBottom={true}

        //  loadEarlier={true}
        infiniteScroll={true}
        onLoadEarlier={function (a) {

          //    console.log(Date.now())
          //  alert(Date.now())
        }}

        // isLoadingEarlier={true}

        renderAvatarOnTop={false}

        placeholder="enter..."
        messages={messages}

        alignTop={false}
        inverted={false}

        // renderMessageText={function (props) {
        //   return <MessageText {...props} customTextStyle={{color:"red"}}  />
        // }}

        // renderCustomView={function (props) { return <Button title="Fdf" /> }}
        // renderFooter={function (props) {    return <Button title="aaa" /> }}

        renderTime={function (props) {
          const currentMessage = props.currentMessage
          //console.log(currentMessage)
          //console.log(props.currentMessage.createdAt)


          return <Time {...props}

            timeFormat="H:mm"
            timeTextStyle={{


              left: {
                color: "#A0A0A0"
              },
              right: {
                color: "#A0A0A0",
                //     ...currentMessage.image && {  backgroundColor: "lightgreen",borderRadius:0 }
                //display:"none"
              }
            }} />
        }}

        renderDay={function (props) {

          return <Day {...props} textStyle={{ color: "#A0A0A0" }} />

        }}

        renderMessage={function (props) {

          const currentMessage = props.currentMessage
          if (currentMessage.video) { return }

          return (

            <MessageBlock inputRef={inputRef} inputText={inputText}
              Message={Message} outerProps={props} inputHeight={inputHeight} keyboardHeight={keyboardHeight} totalBlockHeight={totalBlockHeight}
              messages={messages} />
          )



        }}

        renderBubble={function (props) {

          //  const { currentMessage } = props

          return (
            <BubbleBlock {...props} bgColor={bgColor} item={item} setMessages={setMessages} canMoveDown={canMoveDown} token={token} />
          )
        }}

        renderMessageText={function (props) {



          //return <Text selectable={true} style={{fontSize:20}}>{props.currentMessage.text}</Text>

          return <MessageText {...props}


            textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }} />

          //return <MessageTextBlock {...props} />
          //   return <Pressable onPress={function () { console.log(props.currentMessage.text) }}>

          //   <MessageText {...props} textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }} />
          //  </Pressable>

        }}

        renderSystemMessage={function (props) {

          return <SystemMessage {...props} containerStyle={{ backgroundColor: "pink" }} textStyle={{ color: "red" }}
            wrapperStyle={{ backgroundColor: "yellow" }}
          />

        }}



        showUserAvatar={false}





        onPressAvatar={function ({ currentMessage, ...props }) {

          const avatarName = props._id.replace(/---.*/, "")

          const people = peopleList.find(people => { return people.name === avatarName })

          //     console.log(people.hasAvatar)

          navigation.navigate('Profile', {
            item: { name: people.name, hasAvatar: people.hasAvatar },
            imagePos: 0,
            messages: [
              people.hasAvatar
                ? { image: `${url}/api/image/avatar/${people.name}?${people.randomStr}`, width: 60, height: 60, }
                : { image: "", isSvg: true }
            ],
            setMessages: "",
          })

          // navigation.navigate('Image', {
          //   item: { name: route.params.item.name, hasAvatar: route.params.item.hasAvatar },
          //   imagePos: imageMessageArr.findIndex(item => { return item._id === currentMessage._id }),
          //   messages: imageMessageArr,
          //   // setMessages,
          // })




        }}
        renderAvatar={function (props) {

          return (


            <AvatarIcon {...props}
              containerStyle={{
                left: {
                  marginRight: 0,
                  marginTop: 0,
                  alignSelf: "flex-start",
                  //backgroundColor: "pink",
                  //transform: [{ scale: 0.8 }],
                  //backgroundColor: bgColor,//"pink",
                  padding: 0,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  //borderRadius: 1000,
                },
                right: {
                  marginRight: 0,
                  marginTop: 0,
                  alignSelf: "flex-start",
                  //backgroundColor: "pink",
                  padding: 0,
                  justifyContent: "flex-start",
                  alignItems: "flex-start"
                }


              }} />


          )
        }}

        alwaysShowSend={true}


        keyboardShouldPersistTaps={"never"}

        //     text={inputText}
        onInputTextChanged={text => {
          if (text === "") {
            sendBtnWidth.value = 0
          }
          else {
            sendBtnWidth.value = 60
          }
          inputText.current = text


        }}

        minComposerHeight={60}

        messagesContainerStyle={{


          height: "100%",



          height: height - titleBarHeight - BOTTOM_HEIGHT - 60,
          // backgroundColor: "brown",

          marginEnd: 0,
        }}


        renderInputToolbar={
          function (props) {

            return (



              <InputToolbar {...props}
                containerStyle={{

                  opacity: 1,
                  backgroundColor: "white",
                  marginVertical: 0,

                }}

                primaryStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: "flex",
                  justifyContent: "flex-start",
                  backgroundColor: bgColor,
                  width,
                  minHeight: 60,
                  padding: 0,
                  paddingHorizontal: 0,
                }}
                accessoryStyle={{
                  //  backgroundColor: "orange",
                  //  width: 300,
                  //  width,
                  height: "100%",

                }}

              >
                {props.children}

              </InputToolbar>


            )



          }
        }

        renderActions={
          function (props) {

            return <Actions {...props}
              containerStyle={{
                backgroundColor: bgColor,
                width: 60, height: 60, marginLeft: 0, marginBottom: 0, marginRight: 0,
                alignItems: "center",
                justifyContent: "center"
              }}

              //replaced by icon={function...
              // wrapperStyle={{
              // }}


              icon={function () {

                return <Icon

                  name="mic-outline"
                  type='ionicon'
                  color='#517fa4'
                  size={50}
                />
              }}
            />
          }
        }
        onPressActionButton={
          function () {

            inputHeight.value = 0
            micBarWidth.value = micBarWidth.value === 0
              ? width - 120
              : 0

          }
        }


        renderComposer={
          function (props) {

            // return (
            //   <Input multiline />
            // )

            return (
              <>
                <PanGestureHandler onGestureEvent={backGesture}>
                  <View style={[micBarStyle]} >


                    <Text style={[releasedStyle]}>Hold to talk</Text>

                    <View style={[onHoldStyle]}>
                      <LinearProgress style={{ height: 60, width: width - 120 }} color="#aaa" />

                      <Text style={{
                        fontSize: 20,
                        color: "#666",
                        position: "absolute",
                        textAlign: "center",
                      }}>Move up to cancel</Text>

                    </View>



                  </View>
                </PanGestureHandler>
                <Composer {...props}
                  //   composerHeight={60}
                  //    textInputStyle={{  paddingHorizontal:8 }}

                  // textInputAutoFocus={true}


                  //     multiline={true}
                  disableComposer={false}
                  textInputProps={{
                    // multiline: true,
                    numberOfLines: Math.min([...inputText.current].filter(c => c === "\n").length + 1, 5),
                    style: {
                      backgroundColor: "white", minHeight: 52, width: width - 120, paddingHorizontal: 8, fontSize: 20, lineHeight: 25,


                    },
                    onPressIn: function () {
                      inputRef.current.blur(); inputRef.current.focus(); expandWidth.value = 50;
                      inputHeight.value = 0
                    },
                    //   onPressOut: function () { inputRef.current.blur(); },
                    onPressOut: function () {
                      inputRef.current.blur(); inputRef.current.focus(); expandWidth.value = 50;
                    },


                    ref: function (element) { inputRef.current = element }

                  }}

                //onInputSizeChanged={function(){ setTimeout(function () { scrollRef.current.scrollToEnd() }, 100) }}
                />

              </>
            )

          }
        }

        renderSend={
          function (props) {

            return (
              <>



                <SendBtn outerProps={props} Send={Send} inputHeight={inputHeight} inputRef={inputRef} keyboardHeight={keyboardHeight}

                  micBarWidth={micBarWidth}
                  bgColor={bgColor}
                  sendBtnWidth={sendBtnWidth}
                />
              </>
            )
          }
        }
        onSend={
          function (messages) {




            if (!messages[0].image && !messages[0].audio && !messages[0].video) {
              if (messages[0].text.match(/^[\s]*$/g)) {


                return inputRef.current.blur()

              }

            }




            const messages_ = messages.map(msg => { return { ...msg, createdTime: Date.parse(msg.createdAt), sender: userName, toPerson: item.name } })
            if (userName !== item.name) { socket.emit("sendToAll", { sender: userName, toPerson: item.name, msgArr: messages_ }) }


            canMoveDown.current = true

            setMessages(pre => {
              if (pre.length >= 20) {
                previousMessages.current = previousMessages.current.concat(pre.slice(0, pre.length - 10))
                if (!shouldDisplayNotice && (previousMessages.current.length > 0)) { setShouldDisplayNotice(true) }
                  return GiftedChat.prepend(pre.slice(-10), messages_.map(msg => ({ ...msg, pending: true, sent: true, received: true })))
                //return GiftedChat.prepend(pre.slice(-10), messages_.map(msg => ({ ...msg })))

              }
              else {
                   return GiftedChat.prepend(pre, messages_.map(msg => ({ ...msg, pending: true, sent: true, received: true })))
                //return GiftedChat.prepend(pre, messages_.map(msg => ({ ...msg })))
              }

            })




            const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"


            messages_.forEach(msg => {
              const fileUri = folderUri + item.name + "---" + msg.createdTime
              FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...msg, isLocal: true }))
              latestChattingMsg.current = msg
              // latestChattingMsg(pre => { return { ...pre, [item.name]: "\u2b05 " + msg.text } }) // causing slow down
            })
            //   })



          }
        }


        renderAccessory={
          function (props) {
            //   console.log(props)




            return <View style={[inputBottomStyle]} >


              <Icon
                onPress={function () {
                  canMoveDown.current = true; inputHeight.value = 0; pickImage(setMessages, userName, item, socket, latestChattingMsg, setIsOverLay)
                }}
                name="image-outline"
                type='ionicon'
                color='#517fa4'
                size={50}
              />


              <Icon
                onPress={function () { canMoveDown.current = true; inputHeight.value = 0; takePhoto(setMessages, userName, item, socket, latestChattingMsg, setIsOverLay) }}
                name="camera-outline"
                type='ionicon'
                color='#517fa4'
                size={50}
              />



            </View>
            // return <Button style={{ width: 300, height: 60 }} title="Fdsfdf" onPress={function () {
            //   scrollRef.current.scrollToOffset({ offset: 9999, animated: true })

            // }} />
          }
        }


        renderMessageImage={
          function (props) {

            const currentMessage = props.currentMessage
            const imageMessageArr = messages.filter(message => Boolean(message.image)).map(item => { return { ...item, user: { ...item.user, avatar: "" } } })

            return (
              <ImageBlock item={item} userName={userName} token={token}
                imageMessageArr={imageMessageArr} currentMessage={currentMessage} navigation={navigation} route={route} setMessages={setMessages}
                canMoveDown={canMoveDown} inputRef={inputRef}
              />
            )
          }
        }

        renderMessageAudio={function (message) {




          return <AudioMessage

            message={message}

            item={item} userName={userName}
            bgColor2={bgColor2}
            bgColor={bgColor}
            setMessages={setMessages}
            isText={false} isImage={false} isAudio={true}
            canMoveDown={canMoveDown}
            token={token}

          />






        }}



        // renderMessageVideo={function (message) {
        //   console.log("===============")
        //  // console.log(message.currentMessage)
        //   return <View style={{}}>
        //   <Video
        // //    ref={video}
        //     style={{width:300,height:168.1}}
        //     source={{
        //       uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        //     }}
        //     useNativeControls
        //     resizeMode="contain"
        //     isLooping
        //    // onPlaybackStatusUpdate={status => setStatus(() => status)}
        //   />
        //   {/* <View style={{}}>
        //     <Button
        //       title={status.isPlaying ? 'Pause' : 'Play'}
        //       onPress={() =>
        //         status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
        //       }
        //     />
        //   </View> */}
        // </View>
        // }}

        user={{ _id: userName }
        }

      />
      <Overlay isVisible={isOverLay} fullScreen={true} overlayStyle={{ opacity: 0.5, display: "flex", justifyContent: "center", alignItems: "center" }}  >
        <LinearProgress color="primary" value={1} variant={"indeterminate"} />
        <Text>Processing...</Text>
      </Overlay>

    </>
  )
}


/////
/////
/////































function AudioMessage({ message, item, userName, token, setMessages, canMoveDown, isText, isImage, isAudio, bgColor, bgColor2, ...props }) {


  const viewRef = useAnimatedRef()
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(60)
  const [left, setLeft] = useState(0)


  const currentMessage = message.currentMessage
  const audioUri = FileSystem.documentDirectory + "Audio/" + item.name + "/" + currentMessage.audioName

  //const audioMsg = useRef()

  const audioDuration = Number.parseFloat(currentMessage.durationMillis / 1000).toFixed(1)

  const isPlaying = useSharedValue(false)

  const [disabled, setDisabled] = useState(true)

  const viewStyle1 = useAnimatedStyle(() => {

    return {
      display: isPlaying.value ? "flex" : "none",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      height: 60,
      minWidth: 90,
      width: audioDuration * 10 * 1.5,
      maxWidth: 300,
      //   opacity: withTiming(viewOpacity.value, { duration: 200 })
    }


  })


  const viewStyle2 = useAnimatedStyle(() => {


    return {
      display: isPlaying.value ? "none" : "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      height: 60,
      minWidth: 90,
      width: audioDuration * 10 * 1.5,
      maxWidth: 300,
    }


  })


  const loadAudio = useCallback(function () {


    audioSound.getStatusAsync().then(info => {
      if (!info.isLoaded) {

        audioSound.setOnPlaybackStatusUpdate(function (info) {

          //  console.log(info)
          isPlaying.value = info.isPlaying
        });

        audioSound.loadAsync({ uri: audioUri }, { shouldPlay: true }, true);
      }
      else {

        audioSound.unloadAsync().then(info => {

          audioSound = new Audio.Sound();
          audioSound.setOnPlaybackStatusUpdate(function (info) {
            //     console.log(info)
            isPlaying.value = info.isPlaying
          });

          audioSound.loadAsync({ uri: audioUri }, { shouldPlay: true }, true);

        })
      }


    })




  }, [])

  const unloadAudio = useCallback(function () {


    audioSound.getStatusAsync().then(info => {
      if (info.isLoaded) {



        audioSound.unloadAsync().then(info => {
          isPlaying.value = info.isPlaying
        })
      }



    })




  }, [])




  useEffect(function () {
    if (!currentMessage.mongooseID) {
      setDisabled(false)
    }
    else {

      FileSystem.getInfoAsync(audioUri).then(info => {

        if (info.exists) {

          setDisabled(false)
        }
        else {
          const uri = `${url}/api/audio/download/${currentMessage.mongooseID}`


          const downloadResumable = FileSystem.createDownloadResumable(
            uri, audioUri, { headers: { "x-auth-token": token } },
            function ({ totalBytesExpectedToWrite, totalBytesWritten }) {
              //  console.log(totalBytesWritten + " / " + totalBytesExpectedToWrite)
            }
          );

          downloadResumable.downloadAsync(uri, audioUri, { headers: { "x-auth-token": token } })
            .then(({ status }) => {
              if (status == 200) {
                setDisabled(false)


                //   axios.get(`${url}/api/audio/delete/${currentMessage.mongooseID}`)

              }
              else {
                console.log(status)
              }
            })


        }
      })


    }


    return function () {
      audioSound.getStatusAsync().then(info => {
        if (info.isLoaded) {
          audioSound.unloadAsync()

        }
      })
    }

  }, [])





  return (
    <>
      <View ref={element => { viewRef.current = element }}>
        <View style={[viewStyle1]}>

          <LinearProgress

            color="#aaa"
            // trackColor={currentMessage.isLocal ? "lightgreen" : bgColor}
            // trackColor={bgColor2}
            style={{
              minWidth: 90,
              width: audioDuration * 10 * 1.5,
              maxWidth: 300,
              height: 60,
              position: "absolute", top: 0, left: 0,

            }} />





          <Button title={audioDuration}


            titleStyle={{ color: "#666" }}
            type="clear"
            containerStyle={{ flex: 1, backgroundColor: "transparent" }}

            icon={{
              name: 'stop-circle-outline',
              type: 'ionicon',
              size: 40,
              color: '#666',
            }}

            onPress={function () {
              unloadAudio()

            }}
            onLongPress={function () {


              const handle = findNodeHandle(viewRef.current);
              UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

                if ((py - 18 + (compoHeight - 9) / 2) >= (height / 2)) {
                  setTop(Math.max(py - 72, 0))
                }
                else {
                  setTop(Math.min(height - 132, py - 18 + compoHeight))
                }
                setLeft(currentMessage.user._id !== "myself" ? 52 : width - compoWidth + 52)

              })
              setTimeout(() => { setVisible(true) }, 10);



            }}
          />
        </View>


        <View style={[viewStyle2]}>
          <Button title={audioDuration}
            titleStyle={{ color: "#666" }}
            type="clear"
            containerStyle={{ flex: 1 }}

            disabledTitleStyle={{ color: "#aaa" }}
            disabledStyle={{ backgroundColor: "#aaa" }}



            disabled={disabled}
            icon={{
              name: 'play-circle-outline',
              type: 'ionicon',
              size: 40,
              color: disabled ? '#aaa' : '#666',
            }}

            onPress={function () {

              loadAudio()

            }}
            onLongPress={function () {


              const handle = findNodeHandle(viewRef.current);
              UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

                if ((py - 18 + (compoHeight - 9) / 2) >= (height / 2)) {
                  setTop(Math.max(py - 72, 0))
                }
                else {
                  setTop(Math.min(height - 132, py - 18 + compoHeight))
                }
                setLeft(currentMessage.user._id !== "myself" ? 52 : width - compoWidth + 52)

              })
              setTimeout(() => { setVisible(true) }, 10);



            }}
          />


        </View>
      </View>

      <OverlayCompo
        item={item}
        userName={userName}
        visible={visible} setVisible={setVisible}
        top={top} left={left}
        currentMessage={currentMessage}
        setMessages={setMessages}
        isText={false} isImage={false} isAudio={true}
        canMoveDown={canMoveDown}
        token={token}
      />
    </>
  )
}

function SendBtn({ outerProps, keyboardHeight, inputHeight, inputRef, micBarWidth, bgColor, sendBtnWidth, ...props }) {



  const sendBtnStyle = useAnimatedStyle(() => {


    return {
      height: 60,
      width: withTiming(sendBtnWidth.value, { duration: 200 }),
      //width: sendBtnWidth.value,
      backgroundColor: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      overflow: "hidden",

    }
  })


  return (
    <View style={{ height: 60, width: 60, backgroundColor: bgColor, display: "flex", flexDirection: "row" }}>

      <View style={[sendBtnStyle]} >
        <Send {...outerProps}
          containerStyle={{
            height: 60,
            width: 60
          }}
        >
          <Icon
            name='send'
            type='ionicon'
            color='#517fa4'
            size={40}
            containerStyle={{
              width: 60, height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Send>
      </View>


      <View style={{ height: 60, width: 60, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Icon
          name='add-circle-outline'
          type='ionicon'
          color='#517fa4'
          size={50}
          containerStyle={{
            width: 60, height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={function () {

            if (inputHeight.value === 0 && keyboardHeight === 0) {
              inputHeight.value = 60
              micBarWidth.value = 0
              inputRef.current.blur()
            }
            else if (inputHeight.value !== 0 && keyboardHeight === 0) {
              inputHeight.value = 0
              micBarWidth.value = 0

            }
            else if (keyboardHeight !== 0) {
              inputHeight.value = 0
              micBarWidth.value = 0
              inputRef.current.blur()
            }


          }}
        />

      </View>

    </View>
  )


}

function MessageBlock({ Message, messages, inputRef, inputText, outerProps, inputHeight, keyboardHeight, totalBlockHeight, ...props }) {




  const blockHeightRef = useRef()


  const enterCount = Math.min([...inputText.current].filter(c => c === "\n").length, 5);
  // let extraHeight = [0, 15, 50, 50][enterCount]
  let extraHeight = [0, 15, 50, 85, 120, 120][enterCount]


  const marginTop = useSharedValue(
    outerProps.currentMessage._id === messages[0]
      ? (messages[0]._id && (messages.length < 5))
        ? 300
        : 0
      : 0
  )

  useEffect(function () {


    if (messages[0]) {
      marginTop.value = (outerProps.currentMessage._id === messages[0]._id && (messages.length < 5)) ? 300 : 0
    }

  })


  // const transYValue = useDerivedValue(() => {

  //   if (totalBlockHeight.current < (height * 0.3)) {
  //     return 0 - extraHeight
  //   }
  //   else if (totalBlockHeight.current < (height * 0.5)) {
  //     return -keyboardHeight / 2 - extraHeight
  //   }
  //   else {
  //     return -inputHeight.value - keyboardHeight - extraHeight
  //   }
  // })


  const transYValue = useDerivedValue(() => {

    return -inputHeight.value - keyboardHeight - extraHeight

  })


  const messageBlockStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(transYValue.value, { duration: 100 }) }],
      marginTop: marginTop.value
      //  opacity: opacity.value
    }

  })



  useEffect(function () {

    // console.log(">>>>>", totalBlockHeight.current)
    return function () {
      //  alert(  blockHeightRef.current)
      //  console.log("==+++++++++++=", totalBlockHeight.current)
      //  console.log("==========", totalBlockHeight.current)

      totalBlockHeight.current = totalBlockHeight.current - blockHeightRef.current


    }

  }, [])



  return (

    <View style={[messageBlockStyle]}

      onLayout={function (e) {



        blockHeightRef.current = e.nativeEvent.layout.height //+ imageHeight

        //     console.log(">>>", e.nativeEvent.layout.height, blockHeightRef.current)

        totalBlockHeight.current = totalBlockHeight.current + blockHeightRef.current
      }}

    >
      <Message {...outerProps}


        containerStyle={{

          left: {
            //     backgroundColor: "skyblue",
            alignItems: "flex-start",
            alignSelf: "flex-start",
            padding: 0,
            margin: 0,
            width,
            display: "flex",
            transform: [{ translateX: 0 }]
          },
          right: {
            //     backgroundColor: "green",
            alignItems: "flex-start",
            alignSelf: "flex-start",
            padding: 0,
            margin: 0,
            width,
            display: "flex",
            transform: [{ translateX: 0 }]
          }
        }}
      />
    </View>

  )

}

function BubbleBlock({ token, item, bgColor, setMessages, canMoveDown, ...props }) {

  const viewRef = useAnimatedRef()
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(60)
  const [left, setLeft] = useState(0)

  const currentMessage = props.currentMessage

  const scale = useSharedValue(0)
  const bubbleStyle = useAnimatedStyle(() => {

    return {
      transform: [{ scale: withTiming(scale.value) }]
    }
  })

  useEffect(function () {
    scale.value = 1

  }, [])


  return (
    <>
      <View ref={element => { viewRef.current = element }} style={[bubbleStyle]} >
        <Bubble {...props}

          // onPress={function(){
          //   console.log("sss")
          // }}

          onLongPress={function () {

            const handle = findNodeHandle(viewRef.current);
            UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

              if ((py - 18 + (compoHeight - 9) / 2) >= (height / 2)) {
                setTop(Math.max(py - 72, 0))
              }
              else {
                setTop(Math.min(height - 132, py - 18 + compoHeight))
              }
              setLeft(currentMessage.user._id !== "myself" ? 52 : width - compoWidth + 52)

            })
            setTimeout(() => { setVisible(true) }, 10);

          }}
          wrapperStyle={{

            left: {
              backgroundColor: currentMessage.bgColor,
              justifyContent: 'flex-start',
              overflow: "hidden",

              //      ...currentMessage.image && { backgroundColor: "transparent",borderRadius:0 }
            },
            right: {
              backgroundColor: "lightgreen",
              overflow: "hidden",
              justifyContent: 'flex-start',
              transform: [{ translateX: -9 }],

              //      ...currentMessage.image && {  borderTopRadius:10,borderTopRightRadius:100}
            },

          }}
          textStyle={{
            left: { color: "black", ...currentMessage.image && { display: "none" } },

            right: { color: "black", ...currentMessage.image && { display: "none" } },

          }}
        />
      </View>


      {(!currentMessage.image) && (!currentMessage.audio) && <OverlayCompo
        item={item}
        visible={visible} setVisible={setVisible}
        top={top} left={left}
        currentMessage={currentMessage}
        setMessages={setMessages}
        isText={true} isImage={false}
        canMoveDown={canMoveDown}
        token={token}
      />}

    </>
  )

}

function ImageBlock({ token, scrollRef, item, navigation, route, currentMessage, imageMessageArr, userName, setMessages, canMoveDown, inputRef, ...props }) {

  const viewRef = useAnimatedRef()
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(60)
  const [left, setLeft] = useState(0)

  let imageWidth = currentMessage.imageWidth
  let imageHeight = currentMessage.imageHeight

  // console.log(currentMessage.image)



  if (imageWidth && imageHeight && (imageWidth <= imageHeight)) {
    imageWidth = imageWidth * 200 / imageHeight
    imageHeight = 200
  }

  else if (imageWidth && imageHeight && (imageWidth > imageHeight)) {

    imageHeight = imageHeight * 200 / imageWidth
    imageWidth = 200
  }



  return <>
    <TouchableOpacity
      onPress={function () {
        navigation.navigate('Image', {
          item: { name: route.params.item.name, hasAvatar: route.params.item.hasAvatar },
          imagePos: imageMessageArr.findIndex(item => { return item._id === currentMessage._id }),
          messages: imageMessageArr,
          // setMessages,
        })

      }}
      onPressIn={function () {

        inputRef.current.blur()

      }}
      onLongPress={function () {

        //  console.log(currentMessage)

        const handle = findNodeHandle(viewRef.current);
        UIManager.measure(handle, (fx, fy, compoWidth, compoHeight, px, py) => {

          if ((py - 18 + (compoHeight - 9) / 2) >= (height / 2)) {
            setTop(Math.max(py - 72, 0))
          }
          else {
            setTop(Math.min(height - 132, py - 18 + compoHeight))
          }
          setLeft(currentMessage.user._id !== "myself" ? 52 : width - compoWidth - 9)
        })

        setTimeout(() => { setVisible(true) }, 10);

      }}
    >
      <View ref={element => { viewRef.current = element }}  >
        <SharedElement id={currentMessage._id}  >

          {imageWidth && imageHeight
            ? <ImageV source={{ uri: currentMessage.image, headers: { token: "hihihi" } }} style={{ width: Math.max(60, imageWidth), height: imageHeight }}
              resizeMode={(imageWidth <= 60) ? "cover" : "contain"} />
            : <Image source={{ uri: currentMessage.image, headers: { token: "hihihi" } }} width={200} resizeMode="contain" />
          }
        </SharedElement>
      </View>

    </TouchableOpacity>

    <OverlayCompo
      item={item} userName={userName}
      visible={visible} setVisible={setVisible}
      top={top} left={left}
      currentMessage={currentMessage}
      setMessages={setMessages}
      isText={false} isImage={true}
      canMoveDown={canMoveDown}
      token={token}

    />

  </>
}

function OverlayCompo({ token, visible, top, left, setVisible, currentMessage, isText, isImage, isAudio, setMessages, userName, item, canMoveDown, ...props }) {


  const { setSnackBarHeight, setSnackMsg } = useContext(Context)

  const overlayScale = useSharedValue(0.5)
  const viewStyle = useAnimatedStyle(() => {


    return {

      width: 100,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "gray",
      // transform: [{ scale: withTiming(overlayScale.value) }],
      overflow: "hidden",
    }

  })
  useEffect(function () {
    overlayScale.value = 2
  }, [])


  return <Overlay isVisible={visible} fullScreen={false}
    overlayStyle={{
      backgroundColor: "transparent",// width: 100, height: 60,
      position: "absolute", top, left,
      padding: 0,
      borderWidth: 0,
    }}
    backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5)", }}
    onBackdropPress={function () { setVisible(false) }}
  >
    <ScaleView>
      <View style={[viewStyle]} >

        <Icon
          name={isText ? "copy-outline" : "arrow-down-circle-outline"}
          type='ionicon'
          color='white'
          size={50}
          onPress={function () {

            if (isText) {

              Clipboard.setString(currentMessage.text);
              setTimeout(() => {
                setSnackMsg("copied")
                setSnackBarHeight(60)
              }, 0);
            }
            else if ((isImage) && (currentMessage.user._id !== userName)) {
              downloadFromUri(currentMessage.image, setSnackMsg, setSnackBarHeight)
            }
            else if ((isImage) && (currentMessage.user._id === userName)) {
              downloadFromLocal(currentMessage.image, setSnackMsg, setSnackBarHeight)
            }
            else if (isAudio) {
              const audioUri = FileSystem.documentDirectory + "Audio/" + item.name + "/" + currentMessage.audioName


              downloadFromLocal(audioUri, setSnackMsg, setSnackBarHeight)


            }

            setVisible(false)
          }}
        />
        <Icon
          name="trash-outline"
          type='ionicon'
          color='white'
          size={50}
          onPress={function () {

            canMoveDown.current = false
            if (isText) {

              setMessages(messages => { return messages.filter(msg => { return msg._id !== currentMessage._id }) })
              const fileUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/" + item.name + "---" + currentMessage.createdTime
              setTimeout(() => {
                FileSystem.deleteAsync(fileUri, { idempotent: true })
              }, 800);

            }

            else if (isImage) {
              axios.get(`${url}/api/image/delete/${currentMessage._id}`, { headers: { "x-auth-token": token } }).then(response => {
                // console.log(response.data)
              })

              setMessages(messages => { return messages.filter(msg => { return msg._id !== currentMessage._id }) })
              const fileUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/" + item.name + "---" + currentMessage.createdTime
              FileSystem.deleteAsync(fileUri, { idempotent: true })
              setTimeout(() => {
                currentMessage.isLocal && FileSystem.deleteAsync(currentMessage.image, { idempotent: true })
              }, 800);


            }
            else if (isAudio) {


              setMessages(messages => { return messages.filter(msg => { return msg._id !== currentMessage._id }) })





              setTimeout(() => {


                const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
                const fileUri = folderUri + item.name + "---" + currentMessage.createdTime
                FileSystem.deleteAsync(fileUri, { idempotent: true })

                const audioUri = FileSystem.documentDirectory + "Audio/" + item.name + "/" + currentMessage.audioName
                FileSystem.deleteAsync(audioUri, { idempotent: true })
              }, 800);
            }



          }}
        />
      </View>
    </ScaleView>



  </Overlay>

}

async function pickImage(setMessages, userName, item, socket, latestChattingMsg, setIsOverLay) {
  setIsOverLay(true)
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    // aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if ((!result.cancelled) && (result.uri)) {

    //console.log(FileSystem.documentDirectory)
    //console.log(result.uri)
    //  const _id = Math.random(),

    const uri = result.uri
    const imageName = uri.replace(/^.*[\\\/]/, '')
    const imageFolder = uri.replace(imageName, "") + item.name + "/"
    const imageUri = imageFolder + imageName




    await FileSystem.moveAsync({ from: uri, to: imageUri })

    const time = Date.now()
    const imageMsg = {
      _id: time,
      text: '',
      createdAt: new Date(),
      createdTime: time,
      sender: userName,
      user: { _id: userName },
      image: imageUri,//result.uri,
      imageWidth: result.width,     //"data:image/png;base64," + result.base64,
      imageHeight: result.height,
      toPerson: item.name,
    }



    setMessages(pre => { return [...pre, { ...imageMsg, isLocal: true }] })
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const fileUri = folderUri + item.name + "---" + imageMsg.createdTime
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...imageMsg, isLocal: true }))
    setIsOverLay(false)


    uploadImage({ localUri: imageUri, filename: time, sender: userName, toPerson: item.name, imageWidth: result.width, imageHeight: result.height })
      .then(response => {
        return {
          ...imageMsg,
          ...response.data,
          image: `${url}/api/image/download/${response.data.mongooseID}`,

        }

      }).then(data => {
        socket.emit("sendToAll", { sender: userName, toPerson: item.name, msgArr: [data] })
        latestChattingMsg.current = imageMsg

        //   latestChattingMsg(pre => { return { ...pre, [item.name]: "\u2b05 [image]" } })
      })
  }
  else {
    setIsOverLay(false)
  }
};

async function takePhoto(setMessages, userName, item, socket, latestChattingMsg, setIsOverLay) {
  setIsOverLay(true)
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    //  aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if ((!result.cancelled) && (result.uri)) {


    const uri = result.uri
    const imageName = uri.replace(/^.*[\\\/]/, '')
    const imageFolder = uri.replace(imageName, "") + item.name + "/"
    const imageUri = imageFolder + imageName

    await FileSystem.moveAsync({ from: uri, to: imageUri })


    const time = Date.now()

    const imageMsg = {
      _id: time,
      text: '',
      createdAt: new Date(),
      createdTime: time,
      sender: userName,
      user: { _id: userName },
      image: imageUri,//result.uri,     //"data:image/png;base64," + result.base64,
      imageWidth: result.width,     //"data:image/png;base64," + result.base64,
      imageHeight: result.height,
      toPerson: item.name,
    }

    setMessages(pre => { return [...pre, { ...imageMsg, isLocal: true }] })
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const fileUri = folderUri + item.name + "---" + imageMsg.createdTime
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...imageMsg, isLocal: true }))
    setIsOverLay(false)

    uploadImage({ localUri: imageUri, filename: time, sender: userName, toPerson: item.name, imageWidth: result.width, imageHeight: result.height })
      .then(response => {
        return {
          ...imageMsg,
          ...response.data,
          image: `${url}/api/image/download/${response.data.mongooseID}`,

        }

      }).then(data => {
        socket.emit("sendToAll", { sender: userName, toPerson: item.name, msgArr: [data] })
        latestChattingMsg.current = imageMsg
        //   latestChattingMsg(pre => { return { ...pre, [item.name]: "\u2b05 [image]" } })
      })

  }
  else {
    setIsOverLay(false)
  }
}

async function downloadFromUri(uri, setSnackMsg, setSnackBarHeight) {

  const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
  if (!granted) { return }


  const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`
  const downloadResumable = FileSystem.createDownloadResumable(
    uri,
    fileUri,
    { headers: { token: "hihihi" } },
    function ({ totalBytesExpectedToWrite, totalBytesWritten }) { }   //totalBytesExpectedToWrite === -1
  );

  const { status } = await downloadResumable.downloadAsync(uri, fileUri, { headers: { token: "hihihi" } }).catch(e => { console.log(e) })
  if (status == 200) {
    setSnackMsg("downloaded")
    setSnackBarHeight(60)

    const asset = await MediaLibrary.createAssetAsync(fileUri).catch(e => { console.log(e) });
    let album = await MediaLibrary.getAlbumAsync('expoDownload').catch(e => { console.log(e) });

    if (album == null) { await MediaLibrary.createAlbumAsync('expoDownload', asset, false).catch(e => { console.log(e) }); }
    else { await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).catch(e => { console.log(e) }); }
    await FileSystem.deleteAsync(fileUri, { idempotent: true })

  }
  else { alert("failed") }

}

async function downloadFromLocal(uri, setSnackMsg, setSnackBarHeight) {



  const isImage = Boolean(uri.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/i))
  const isAudio = Boolean(uri.match(/\.(m4a|mp3|3gp)$/i))



  const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
  if (!granted) { return }

  setSnackMsg("downloaded")
  setSnackBarHeight(60)



  const asset = await MediaLibrary.createAssetAsync(uri)
  let album = await MediaLibrary.getAlbumAsync(isAudio ? 'expoAudio' : 'expoDownload')

  if (album == null) { await MediaLibrary.createAlbumAsync(isAudio ? "expoAudio" : 'expoDownload', asset, false) }
  else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
  }

  ///



}

async function uploadImage({ localUri, filename, sender, toPerson, imageWidth, imageHeight }) {



  const formData = new FormData();
  let match = /\.(\w+)$/.exec(localUri.split('/').pop());

  const ext = match[1] || ""
  let type = match ? `image/${match[1]}` : `image`;

  //  console.log(type,filename + "." + ext)

  formData.append('file', { uri: localUri, name: filename + "." + ext, type });
  formData.append("obj", JSON.stringify({ ownerName: sender, toPerson, picName: filename, imageWidth, imageHeight, sender }))

  return axios.post(`${url}/api/image/uploadimage`, formData, { headers: { 'content-type': 'multipart/form-data', /*"x-auth-token": token*/ }, })
    .then(response => {

      //  FileSystem.deleteAsync(localUri, { idempotent: true })
      return response
    })



}


function startRecording({ messages, setMessages, userName, item, previousMessages, canMoveDown, shouldDisplayNotice, setShouldDisplayNotice }) {
  recording = new Audio.Recording()

  // recording.setOnRecordingStatusUpdate(function (info) {
  //   if (info.isRecording && info.durationMillis >= 2000) {
  //   }
  // })

  // await Audio.setAudioModeAsync({
  //   allowsRecordingIOS: true,
  //   playsInSilentModeIOS: true,
  // });




  Audio.requestPermissionsAsync()
    .then((info) => {

      //  console.log("permissions", info)

      if (info.granted) {
        return recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
      }
      else {
        return Promise.reject("recording permissions denied")
      }

    })
    .then(info => {

      // console.log("about to record", info)

      if (info.canRecord && (!info.isRecording)) {
        return recording.startAsync()
      }
      else {
        return Promise.reject("cannot start recording")
      }

    })
    .then(info => {
      return info
    })
    .catch(err => {
      console.log("error in startRecording promise ==>")
    })



}

function stopRecording({ messages, setMessages, userName, item, previousMessages, canMoveDown, shouldDisplayNotice, setShouldDisplayNotice, socket, latestChattingMsg }) {

  let uri = ""
  let audioName = ""
  let audioFolder = ""
  let audioUri = ""
  let durationMillis = ""
  let time = ""
  let audioMsg = ""

  recording.getStatusAsync()
    .then(info => {

      //     console.log("about to stop Recording", info)
      if (info.isRecording) {

        return recording.stopAndUnloadAsync()
      }
      else {

        //     recording.stopAndUnloadAsync()
        return Promise.reject(info)
      }
    })
    .then(info => {
      //     console.log("recording stopped", info)
      if (info.isDoneRecording) {
        durationMillis = info.durationMillis
        uri = recording.getURI();

        audioName = uri.replace(/^.*[\\\/]/, '')
        audioFolder = FileSystem.documentDirectory + "Audio/" + item.name + "/"
        audioUri = audioFolder + audioName



        recording = new Audio.Recording()

        return FileSystem.moveAsync({ from: uri, to: audioUri })
      }
      else {
        //   recording.stopAndUnloadAsync()
        return Promise.reject(info)
      }


    })
    .then(() => {

      time = Date.now()
      audioMsg = {
        _id: time,
        text: '',
        createdAt: new Date(),
        createdTime: time,
        user: { _id: userName },
        sender: userName,
        audio: audioUri,
        audioName: audioName,
        durationMillis: durationMillis,
        toPerson: item.name,
      }

      canMoveDown.current = true
      setMessages(pre => {
        if (pre.length >= 20) {
          previousMessages.current = previousMessages.current.concat(pre.slice(0, pre.length - 10))
          if (!shouldDisplayNotice && (previousMessages.current.length > 0)) { setShouldDisplayNotice(true) }
          return GiftedChat.prepend(pre.slice(-10), { ...audioMsg, isLocal: true })
        }
        else {
          return GiftedChat.prepend(pre, { ...audioMsg, isLocal: true })
        }
      })


      const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
      const fileUri = folderUri + item.name + "---" + audioMsg.createdTime
      FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...audioMsg, isLocal: true }))
      latestChattingMsg.current = audioMsg

      return uploadAudio({ localUri: audioUri, filename: audioName || Date.now() + ".m4a", sender: userName, toPerson: item.name, durationMillis })

    })
    .then(response => {
      //   console.log(ExponentAV)
      socket.emit("sendToAll", {
        sender: userName, toPerson: item.name,
        msgArr: [{ ...audioMsg, sender: userName, mongooseID: response.data.mongooseID }]
      })

      //console.log(recording._cleanupForUnloadedRecorder)

    })
    .catch(err => {
      console.log("cannot stop recording")
      // if (err.message.includes("Stop encountered an error: recording not stopped")) {
      //   await ExponentAV.unloadAudioRecorder();
      //   await recordRef.current._cleanupForUnloadedRecorder({ durationMillis: 0 } as any);
      // } else {
      //   await handleError(e, { userMessage: "An error occurred stopping the recording." });
      // }

      recording._cleanupForUnloadedRecorder({
        canRecord: false,
        durationMillis: 0,
        isRecording: false,
        isDoneRecording: false,
      });


      recording = new Audio.Recording()
    })




}


function uploadAudio({ localUri, filename, sender, toPerson, durationMillis }) {

  const formData = new FormData();
  formData.append('file', { uri: localUri, name: filename, type: "audio/m4a" });
  formData.append("obj", JSON.stringify({ ownerName: sender, toPerson, filename, sender, durationMillis }))

  return axios.post(`${url}/api/audio/uploadaudio`, formData, { headers: { 'content-type': 'multipart/form-data', /*"x-auth-token": token*/ }, })
    .then(response => {

      //  FileSystem.deleteAsync(localUri, { idempotent: true })
      return response
    })



}



function cancelRecording() {
  //  console.log('Cancel recording..');


  recording.getStatusAsync()
    .then(info => {

      ////     console.log("about to cancel Recording", info)
      if (info.isRecording) {
        return recording.stopAndUnloadAsync()
      }
      else {
        //recording = new Audio.Recording()
        return Promise.reject(info)
      }
    })
    .then(info => {
      //    console.log("recording cancelled", info)
      if (info.isDoneRecording) {
        // const durationMillis = info.durationMillis
        const uri = recording.getURI();
        //      console.log("cancel uri===>>>>>>>>",uri)

        FileSystem.deleteAsync(uri, { idempotent: true }).then(() => {

          //      console.log("caneled file deleted ")
        })



      }
      else {
        //  recording = new Audio.Recording()
        return Promise.reject(info)
      }
    })
    .catch(err => {
      console.log("cancel recording error")
      recording._cleanupForUnloadedRecorder({
        canRecord: false,
        durationMillis: 0,
        isRecording: false,
        isDoneRecording: false,
      });

      recording = new Audio.Recording()
    })



}


// ChatAllScreen.sharedElements = (route, otherRoute, showing) => {

//   console.log(route)

//   let messageArr = []
//   if (otherRoute && otherRoute.route && otherRoute.route.params && otherRoute.route.params.messages) {
//     messageArr = otherRoute.route.params.messages.map(item => {
//       return { id: item._id, animation: "move", resize: "auto", align: "left" }
//     })

//   }

//   return [
//     { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },
//     // ...messageArr,   // turn back shared image transition off
//   ]
// };
