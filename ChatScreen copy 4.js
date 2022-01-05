import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';
import * as Device from 'expo-device';
import axios from 'axios';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, UIManager, findNodeHandle,

  SafeAreaView,
  KeyboardAvoidingView,

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
  useAnimatedRef

} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, Image: ImageV, ScrollView: ScrollV } = ReAnimated

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
import { Video, AVPlaybackStatus } from 'expo-av';

import Image from 'react-native-scalable-image';

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { OverlayDownloader } from "./OverlayDownloader";
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';

import { Audio } from 'expo-av';


//import Snackbar from 'expo-snackbar';
//import SnackBar from 'react-native-snackbar-component';

import SnackBar, { SnackContext } from "./SnackBar";

import jwtDecode from 'jwt-decode';

import url, { hexToRgbA, hexify, uniqByKeepFirst } from "./config";
import { Path } from 'react-native-svg';











export function ChatScreen({ navigation, route, ...props }) {


  const item = route.params.item
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

  const { token, userName, socket, setSnackBarHeight, setSnackMsg, appState, unreadCountObj, setUnreadCountObj, } = useContext(Context)
  const [shouldDisplayNotice, setShouldDisplayNotice] = useState(true)
  const canMoveDown = useRef(true)

  const [messages, setMessages] = useState([])

  const previousMessages = useRef([])

  const scrollRef = useRef()

  const inputRef = useRef()
  const [inputText, setInputText] = useState("")


  const expandWidth = useSharedValue(50)






  //display message
  useEffect(function () {

    socket.on("displayMessage" + item.name, function (msgArr) {

      canMoveDown.current = true
      let msgArr_ = msgArr.map(msg => {

        return {
          ...msg,
          user: {
            _id: msg.sender + "---" + Math.random(),
            avatar: () => {
              return item.hasAvatar
                ? <ImageV source={{ uri: `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
                  style={{
                    position: "relative",

                    width: 36, height: 36, borderRadius: 1000
                  }} />
                : <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name)} />

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
      socket.off("displayMessage" + item.name)
    }
  }, [])

  //initalizing message container
  useEffect(async function () {



    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const info = await FileSystem.getInfoAsync(folderUri)

    // console.log(info)
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(folderUri);
    }



    FileSystem.readDirectoryAsync(folderUri).then(data => {
      const promiseArr = []
      //      console.log(data.length)

      data.forEach(msgFile => {
        //  console.log(msgFile)

        promiseArr.push(FileSystem.readAsStringAsync(folderUri + msgFile).then(content => {
          const msg = JSON.parse(content)
          const isLocal = Boolean(msg.isLocal)


          msg.user.avatar = () => {
            return item.hasAvatar
              ? <ImageV source={{ uri: `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
                style={{
                  position: "relative",

                  width: 36, height: 36, borderRadius: 1000
                }} />
              : <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(isLocal ? userName : item.name, false)} />

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

        scrollRef.current.scrollToOffset({ offset: 9999, animated: true })
      }, 0);


    });

    return function () {
      keyboardDidShowListener.remove()
    }

  }, [])







  const sendBtnStyle = useAnimatedStyle(() => {



    return {
      width: withTiming(expandWidth.value, { duration: 100 }),
      // backgroundColor: "pink",
      borderRadius: 0,
      height: 50,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-end",

      //position:"absolute",
      //right:8,
    }

  })

  const [inputBarHeight, setInputBarHeight] = useState(60)


  const inputHeight = useSharedValue(60)
  const bodyStyle = useAnimatedStyle(() => {

    return {
      height: withTiming(height - titleBarHeight - BOTTOM_HEIGHT - keyboardHeight - inputHeight.value, { duration: 100 }),


      //  height: height - titleBarHeight - BOTTOM_HEIGHT - inputHeight.value,
      //  paddingBottom: withTiming(Math.max(0, keyboardHeight - 60), { duration: 200 }),


      backgroundColor: "skyblue"
    }

  })

  const inputBarView = useAnimatedStyle(() => {

    return {
      height: withTiming(inputHeight.value),
      backgroundColor: "blue",
      position: "absolute",
      bottom: 0,
      width,
      opacity: 0.5,
      overflow: "hidden"
    }
  })


  // const bodyStyle = {
  //   //height: height - titleBarHeight - BOTTOM_HEIGHT - keyboardHeight - inputHeight.value,
  //   //  height: height - titleBarHeight - BOTTOM_HEIGHT  - inputHeight.value,
  //   //height: "100%",
  //   backgroundColor: "skyblue",
  //   flex:1,
  // }


  const inputStyle = useAnimatedStyle(() => {

    return {
      width: 360,
      //   height: withTiming(inputHeight.value),
      height: 60,
      backgroundColor: "yellow",
      opacity: 0.5,
    }

  })

































  return (

    <>

      <View style={{
        alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: bgColor, padding: 0, elevation: 1, position: "relative",
        height: titleBarHeight,

      }}>



        <SharedElement id={item.name} style={{ transform: [{ scale: 0.56 }], alignItems: "center", justifyContent: "center", }}   >

          {item.hasAvatar
            ? <ImageV source={{ uri: `${url}/api/image/avatar/${item.name}` }} resizeMode="cover"
              style={{
                position: "relative",
                top: getStatusBarHeight(),
                width: 60, height: 60, borderRadius: 1000
              }} />
            : <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
          }


        </SharedElement>



        <Text style={{ position: "relative", fontSize: 20, top: getStatusBarHeight() / 2 }}>{item.name}</Text>

      </View >


      {/* <View style={[bodyStyle]} > */}
      <GiftedChat

        listViewProps={{
          ref: (element) => { scrollRef.current = element },
          onScroll: function (e) {
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
          onLayout: function () { },
          onContentSizeChange: () => {
            //   scrollRef.current.scrollToEnd({ animated: true })
            if (canMoveDown.current) {
              scrollRef.current.scrollToOffset({ offset: 9999, animated: true })
            }
            //     else{
            //  canMoveDown.current = true
            //     }

          }
        }}

        // bottomOffset={300}
        // minInputToolbarHeight={60}
        renderUsernameOnMessage={false}
        scrollToBottom={false}

        //  loadEarlier={true}
        infiniteScroll={true}
        onLoadEarlier={function (a) {

          console.log(Date.now())
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

            <Message {...props} containerStyle={{

              left: {
                //   backgroundColor: "skyblue",
                alignItems: "flex-start",
                alignSelf: "flex-start",
                padding: 0,
                margin: 0,
                width,
                display: "flex",
                transform: [{ translateX: 0 }]
              },
              right: {
                //    backgroundColor: "green",
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

          )
        }}

        renderBubble={function (props) {

          const { currentMessage } = props

          return (

            <ScaleView>

              <BubbleBlock {...props} bgColor={bgColor} item={item} setMessages={setMessages} canMoveDown={canMoveDown} token={token} />

            </ScaleView>


          )
        }}

        renderMessageText={function (props) {

          //return <MessageTextBlock {...props} />
          return <MessageText {...props} textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }} />

        }}

        renderSystemMessage={function (props) {

          return <SystemMessage {...props} containerStyle={{ backgroundColor: "pink" }} textStyle={{ color: "red" }}
            wrapperStyle={{ backgroundColor: "yellow" }}
          />

        }}



        showUserAvatar={false}
        renderAvatar={function (props) {

          return (

            <ScaleView>

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

            </ScaleView>
          )
        }}

        alwaysShowSend={true}


        keyboardShouldPersistTaps={"never"}




        text={inputText}
        onInputTextChanged={text => setInputText(text)}





        minComposerHeight={60}
        messagesContainerStyle={{

          //   paddingBottom: 60,
          //   height: "100%",

          height: height - titleBarHeight - BOTTOM_HEIGHT - keyboardHeight - inputBarHeight,


          backgroundColor: "brown",
          marginEnd: 0,
        }}
        renderInputToolbar={
          function (props) {

            return (

              <View style={[inputBarView]}>
                <InputToolbar {...props}
                  containerStyle={{
                    // height: 0,
                    height: 120,
                    opacity: 1,
                    backgroundColor: "green",
                    marginVertical: 0,
                    overflow: "hidden",
                    position: "absolute",
                    top: 0,
                  }}

                  primaryStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "yellow",
                  }}
                  accessoryStyle={{
                    backgroundColor: "orange",
                    // width: 300,
                    height: "100%",

                  }}

                >
                  {props.children}
                </InputToolbar>
              </View>

            )
          }
        }

        renderActions={
          function (props) {
            return <Actions {...props} containerStyle={{ backgroundColor: "blue", width: 50, height: 50, margin: 0 }}
            // icon={function () {

            //   return <Icon
            //     // onPress={function () {
            //     //   canMoveDown.current = true; pickImage(setMessages, userName, item, socket)
            //     // }}
            //     name="image-outline"
            //     type='ionicon'
            //     color='#517fa4'
            //     size={inputText ? 0 : 50}
            //   />
            // }}


            />





          }
        }
        onPressActionButton={function () {
        //  setInputBarHeight(pre => { return pre === 60 ? 120 : 60 })
        }}


        renderComposer={function (props) {
          return (
            <>
              <Composer {...props}
                //   composerHeight={60}
                textInputStyle={{ fontSize: 20, lineHeight: 30 }}

                disableComposer={false}
                textInputProps={{
                  style: { backgroundColor: "skyblue", height: 60 },
                  onPressIn: function () {
                    inputRef.current.blur(); inputRef.current.focus(); expandWidth.value = 50;


                  },
                  onPressOut: function () { inputRef.current.blur(); },

                  ref: function (element) { inputRef.current = element }

                }}

              //onInputSizeChanged={function(){ setTimeout(function () { scrollRef.current.scrollToEnd() }, 100) }}
              />

            </>
          )

        }}

        renderSend={function (props) {

          return (
            <Send {...props}

              //   ref={(element) => { console.log(element) }}
              containerStyle={{
                alignSelf: !inputText || inputText.indexOf("\n") === -1 ? "center" : "flex-end",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                margin: 0,
                padding: 0,

              }}>

              <View style={
                [sendBtnStyle]
              }>

                <Icon
                  onPress={function () {
                    canMoveDown.current = true; pickImage(setMessages, userName, item, socket)
                  }}
                  name="image-outline"
                  type='ionicon'
                  color='#517fa4'
                  size={inputText ? 0 : 50}
                />


                <Icon
                  onPress={function () { canMoveDown.current = true; takePhoto(setMessages, userName, item, socket) }}
                  name="camera-outline"
                  type='ionicon'
                  color='#517fa4'
                  size={inputText ? 0 : 50}
                />


                <Icon
                  onPress={function () { }}
                  name="film-outline"
                  type='ionicon'
                  color='#517fa4'
                  size={inputText ? 0 : 50}
                />

                <Icon
                  {...(!inputText) && {
                    onPress: function () { expandWidth.value = expandWidth.value === 50 ? 200 : 50 }
                  }}

                  name={inputText ? 'send' : expandWidth.value === 50 ? 'add-circle-outline' : 'remove-circle-outline'}
                  type='ionicon'
                  color='#517fa4'
                  size={inputText ? 45 : 50}
                //    containerStyle={{backgroundColor:'#517fa4',}}
                />

              </View>
            </Send>
          )
        }}



        onSend={function (messages) {

          const messages_ = messages.map(msg => { return { ...msg, createdTime: Date.parse(msg.createdAt), sender: userName } })
          if (userName !== item.name) { socket.emit("sendMessage", { sender: userName, toPerson: item.name, msgArr: messages_ }) }


          canMoveDown.current = true

          setMessages(pre => {
            if (pre.length >= 20) {
              previousMessages.current = previousMessages.current.concat(pre.slice(0, pre.length - 10))
              if (!shouldDisplayNotice && (previousMessages.current.length > 0)) { setShouldDisplayNotice(true) }
              return GiftedChat.prepend(pre.slice(-10), messages_.map(msg => ({ ...msg, pending: true, sent: true, received: true })))
            }
            else {
              return GiftedChat.prepend(pre, messages_.map(msg => ({ ...msg, pending: true, sent: true, received: true })))
            }

          })




          const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"

          FileSystem.getInfoAsync(folderUri)
            .then(info => {
              if (!info.exists) {
                return FileSystem.makeDirectoryAsync(folderUri)
              }
              else {
                return info
              }
            })
            .then(() => {
              //   FileSystem.writeAsStringAsync(fileUri, JSON.stringify(msg))
              messages_.forEach(msg => {
                const fileUri = folderUri + item.name + "---" + msg.createdTime
                FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...msg, isLocal: true }))

              })
            })



        }}


        renderAccessory={function () {
          return <Button style={{ width: 300, height: 60 }} title="Fdsfdf" />
        }}


        renderMessageImage={function (props) {

          const currentMessage = props.currentMessage
          const imageMessageArr = messages.filter(message => Boolean(message.image)).map(item => { return { ...item, user: { ...item.user, avatar: "" } } })

          return (
            <ImageBlock item={item} userName={userName} token={token}
              imageMessageArr={imageMessageArr} currentMessage={currentMessage} navigation={navigation} route={route} setMessages={setMessages}
              canMoveDown={canMoveDown}
            />
          )
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


      {/* <View style={[inputStyle]} >
          <Input value={inputText} onChangeText={function (text) {
            setInputText(text)
          }}
          />
        </View> */}

      {/* </View> */}













      {/* <OverlayDownloader overLayOn={overLayOn} setOverLayOn={setOverLayOn} uri={uri} fileName={Date.now() + ".jpg"} /> */}

    </>
  )
}


/////
/////
/////























































ChatScreen.sharedElements = (route, otherRoute, showing) => {

  let messageArr = []
  if (otherRoute && otherRoute.route && otherRoute.route.params && otherRoute.route.params.messages) {
    messageArr = otherRoute.route.params.messages.map(item => {
      return { id: item._id, animation: "move", resize: "auto", align: "left" }
    })

  }

  return [
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },
    // ...messageArr,   // turn back image transition off
  ]
};

function ScaleView(props) {

  const scale = useSharedValue(0)
  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(scale.value, { duration: 200 }) },
        //   {translateX: withTiming(interpolate(scale.value, [0, 1], [-100, 0]), {duration: 2000 }) }
      ],
      //  opacity: withTiming(scale.value, {duration: 200 }),
      overflow: "hidden",
    }
  })

  useEffect(function () {
    scale.value = 1
  }, [])

  return (
    <View style={scaleStyle}    >
      {props.children}
    </View>
  )
}


function BubbleBlock({ token, item, bgColor, setMessages, canMoveDown, ...props }) {

  const viewRef = useAnimatedRef()
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(60)
  const [left, setLeft] = useState(0)

  const currentMessage = props.currentMessage

  return (
    <>
      <View ref={element => { viewRef.current = element }}  >
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
              backgroundColor: bgColor,
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


      <OverlayCompo
        item={item}
        visible={visible} setVisible={setVisible}
        top={top} left={left}
        currentMessage={currentMessage}
        setMessages={setMessages}
        isText={true} isImage={false}
        canMoveDown={canMoveDown}
        token={token}
      />

    </>
  )

}

function ImageBlock({ token, scrollRef, item, navigation, route, currentMessage, imageMessageArr, userName, setMessages, canMoveDown, ...props }) {

  const viewRef = useAnimatedRef()
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(60)
  const [left, setLeft] = useState(0)

  let imageWidth = currentMessage.imageWidth
  let imageHeight = currentMessage.imageHeight

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

function OverlayCompo({ token, visible, top, left, setVisible, currentMessage, isText, isImage, setMessages, userName, item, canMoveDown, ...props }) {


  const { setSnackBarHeight, setSnackMsg } = useContext(Context)



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
      <View style={{ width: 100, display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: "gray" }} >

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

          }}
        />
      </View>
    </ScaleView>



  </Overlay>

}



async function pickImage(setMessages, userName, item, socket) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    // aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if ((!result.cancelled) && (result.uri)) {


    //  const _id = Math.random(),

    const time = Date.now()


    const imageMsg = {
      _id: time,
      text: '',
      createdAt: time,
      createdTime: time,

      user: { _id: userName },
      image: result.uri,
      imageWidth: result.width,     //"data:image/png;base64," + result.base64,
      imageHeight: result.height
    }



    setMessages(pre => { return [...pre, { ...imageMsg, isLocal: true }] })
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const fileUri = folderUri + item.name + "---" + imageMsg.createdTime
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...imageMsg, isLocal: true }))

    // todo: send image to server

    uploadImage({ localUri: result.uri, filename: time, sender: userName, toPerson: item.name, imageWidth: result.width, imageHeight: result.height })
      .then(response => {
        return {
          ...imageMsg,
          ...response.data,
          image: `${url}/api/image/download/${response.data.mongooseID}`,

        }

      }).then(data => {
        socket.emit("sendMessage", { sender: userName, toPerson: item.name, msgArr: [data] })
      })




  }
};

async function takePhoto(setMessages, userName, item, socket) {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    //  aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if ((!result.cancelled) && (result.uri)) {
    const time = Date.now()

    const imageMsg = {
      _id: time,
      text: '',
      createdAt: time,
      createdTime: time,

      user: { _id: userName },
      image: result.uri,     //"data:image/png;base64," + result.base64,
      imageWidth: result.width,     //"data:image/png;base64," + result.base64,
      imageHeight: result.height
    }

    setMessages(pre => { return [...pre, { ...imageMsg, isLocal: true }] })
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const fileUri = folderUri + item.name + "---" + imageMsg.createdTime
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...imageMsg, isLocal: true }))


    uploadImage({ localUri: result.uri, filename: time, sender: userName, toPerson: item.name, imageWidth: result.width, imageHeight: result.height })
      .then(response => {
        return {
          ...imageMsg,
          ...response.data,
          image: `${url}/api/image/download/${response.data.mongooseID}`,

        }

      }).then(data => {
        socket.emit("sendMessage", { sender: userName, toPerson: item.name, msgArr: [data] })
      })


    // todo: send image to server
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



  const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
  if (!granted) { return }

  setSnackMsg("downloaded")
  setSnackBarHeight(60)


  const asset = await MediaLibrary.createAssetAsync(uri)
  let album = await MediaLibrary.getAlbumAsync('expoDownload')
  if (album == null) { await MediaLibrary.createAlbumAsync('expoDownload', asset, true) }
  else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, true)
  }



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






