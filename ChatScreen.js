import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, UIManager, findNodeHandle } from 'react-native';

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

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button, Tooltip, Icon } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';


import { SharedElement } from 'react-navigation-shared-element';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Context } from "./ContextProvider"

import { GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer, MessageImage } from 'react-native-gifted-chat'
import { Video, AVPlaybackStatus } from 'expo-av';

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

import url, { hexToRgbA, hexify, uniqByKeepFirst } from "./config";

export function ChatScreen({ navigation, route, ...props }) {


  const item = route.params.item
  //console.log(item)






  const avatarString = multiavatar(item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))

  const { userName, socket, setSnackBarHeight, setSnackMsg, appState } = useContext(Context)
  const [shouldDisplayNotice, setShouldDisplayNotice] = useState(true)
  const canMoveDown = useRef(true)

  const [messages, setMessages] = useState([])

  const previousMessages = useRef([])

  const scrollRef = useRef()

  const inputRef = useRef()
  const [inputText, setInputText] = useState("")


  const expandWidth = useSharedValue(50)
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



  // const [overLayOn, setOverLayOn] = useState(false)
  // const [uri, setUri] = useState()



  useEffect(function () {

    socket.on("displayMessage" + item.name, function (msgArr) {

      canMoveDown.current = true
      let msgArr_ = msgArr.map(msg => {

        return {
          ...msg,
          user: {
            _id: msg.sender + "---" + Math.random(),
            avatar: () => <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />
          }
        }

      })

      // setMessages(pre => {
      //   msgArr_ = uniqByKeepFirst([...pre, ...msgArr_], function (msg) { return msg._id })
      //   return [...msgArr_]
      // })

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

        //   if (pre.length >= 20) {
        //     previousMessages.current = previousMessages.current.concat(pre.slice(0, pre.length - 20))
        //     if (!shouldDisplayNotice && (previousMessages.current.length > 0)) { setShouldDisplayNotice(true) }

        //     msgArr_ =  uniqByKeepFirst([...pre.slice(-20), ...msgArr_], function (msg) { return msg._id })

        //     return GiftedChat.prepend(msgArr_)
        //   }
        //   else {
        // //    msgArr_ = uniqByKeepFirst([...pre, ...msgArr_], function (msg) { return msg._id })
        //     return GiftedChat.prepend(pre, msgArr_)
        //   }

      })




    })


    return function () {
      socket.off("displayMessage" + item.name)
    }
  }, [])



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


          msg.user.avatar = () => <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(isLocal ? userName : item.name, false)} />
          msg.user._id = isLocal ? userName : msg.user._id + "---" + Math.random()

          return msg
        })
        )
      })
      Promise.all(promiseArr).then(msgArr => {

        //  console.log(msgArr)

        previousMessages.current = uniqByKeepFirst([...msgArr, ...messages], function (msg) { return msg._id })


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
          setMessages(pre => {
            return msgArr_
          })



        }
        if (previousMessages.current.length === 0) { setShouldDisplayNotice(false) }


      })

    })

  }, [])

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



  return (

    <>

      <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: bgColor, padding: 0, elevation: 1, position: "relative" }}>



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



        minComposerHeight={50}
        // renderCustomView={function (props) { return <Button title="Fdf" /> }}
        // renderFooter={function (props) {    return <Button title="aaa" /> }}

        renderTime={function (props) {

          //console.log(props.currentMessage.createdAt)
          return <Time {...props} timeTextStyle={{

            left: {
              color: "#A0A0A0"
            },
            right: {
              color: "#A0A0A0",
              //display:"none"
            }
          }} />
        }}

        renderDay={function (props) {

          return <Day {...props} textStyle={{ color: "#A0A0A0" }} />

        }}



        messagesContainerStyle={{
          //backgroundColor: "yellow",
          display: "flex", justifyContent: "flex-start",
          alignItems: "flex-start", flexDirection: "row", alignSelf: "flex-start",
          margin: 0, padding: 0,

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

              <BubbleBlock {...props} bgColor={bgColor} item={item} setMessages={setMessages} canMoveDown={canMoveDown} />

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

        renderComposer={function (props) {
          return (
            <Composer {...props}
              textInputStyle={{ fontSize: 20, lineHeight: 30 }}
              textInputProps={{
                onPressIn: function () {
                  inputRef.current.blur(); inputRef.current.focus(); expandWidth.value = 50;


                },
                onPressOut: function () { inputRef.current.blur(); },

                ref: function (element) { inputRef.current = element }

              }}

            //onInputSizeChanged={function(){ setTimeout(function () { scrollRef.current.scrollToEnd() }, 100) }}
            />

          )

        }}


        text={inputText}
        onInputTextChanged={text => setInputText(text)}



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
                  onPress={function () { canMoveDown.current = true; pickImage(setMessages, userName, item, scrollRef) }}
                  name="image-outline"
                  type='ionicon'
                  color='#517fa4'
                  size={inputText ? 0 : 50}
                />


                <Icon
                  onPress={function () { canMoveDown.current = true; takePhoto(setMessages, userName, item, scrollRef) }}
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

        renderInputToolbar={
          function (props) {
            return <InputToolbar {...props} containerStyle={{ display: "flex", flexDirection: "row", alignItems: "center", }} >
              {props.children}
            </InputToolbar>
          }
        }

        renderMessageImage={function (props) {

          const currentMessage = props.currentMessage
          const imageMessageArr = messages.filter(message => Boolean(message.image)).map(item => { return { ...item, user: { ...item.user, avatar: "" } } })

          return (
            <ImageBlock item={item} userName={userName}
              imageMessageArr={imageMessageArr} currentMessage={currentMessage} navigation={navigation} route={route} setMessages={setMessages}
              canMoveDown={canMoveDown}
            />
          )
        }}

        // onPressActionButton={function () {
        //   alert("fdsf")
        // }}

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

      {/* <OverlayDownloader overLayOn={overLayOn} setOverLayOn={setOverLayOn} uri={uri} fileName={Date.now() + ".jpg"} /> */}

    </>
  )
}


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
        //   { translateX: withTiming(interpolate(scale.value, [0, 1], [-100, 0]), { duration: 2000 }) }
      ],
      //  opacity: withTiming(scale.value, { duration: 200 }),
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


function BubbleBlock({ item, bgColor, setMessages, canMoveDown, ...props }) {

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

            },
            right: {
              backgroundColor: "lightgreen",
              overflow: "hidden",
              justifyContent: 'flex-start',
              transform: [{ translateX: -9 }]
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
      />

    </>
  )

}

function ImageBlock({ scrollRef, item, navigation, route, currentMessage, imageMessageArr, userName, setMessages, canMoveDown, ...props }) {

  const viewRef = useAnimatedRef()
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(60)
  const [left, setLeft] = useState(0)

  return <>
    <TouchableOpacity
      onPress={function () {
        navigation.navigate('Image', {
          item: { name: route.params.item.name },
          imagePos: imageMessageArr.findIndex(item => { return item._id === currentMessage._id }),
          messages: imageMessageArr,
          // setMessages,
        })

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
          setLeft(currentMessage.user._id !== "myself" ? 52 : width - compoWidth - 9)
        })

        setTimeout(() => { setVisible(true) }, 10);

      }}
    >
      <View ref={element => { viewRef.current = element }}  >
        <SharedElement id={currentMessage._id}  >
          <Image source={{ uri: currentMessage.image, headers: { token: "hihihi" } }} width={200} resizeMode="contain" />
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
    />

  </>
}

function OverlayCompo({ visible, top, left, setVisible, currentMessage, isText, isImage, setMessages, userName, item, canMoveDown, ...props }) {


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



async function pickImage(setMessages, userName, item, scrollRef) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    // aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if ((!result.cancelled) && (result.uri)) {
    const time = Date.now()

    const imageMsg = {
      _id: Math.random(),
      text: '',
      createdAt: time,
      createdTime: time,

      user: { _id: userName },
      image: result.uri     //"data:image/png;base64," + result.base64,
    }

    setMessages(pre => { return [...pre, { ...imageMsg, isLocal: true }] })
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const fileUri = folderUri + item.name + "---" + imageMsg.createdTime
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...imageMsg, isLocal: true }))

    // todo: send image to server


  }
};

async function takePhoto(setMessages, userName, item, scrollRef) {
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
      _id: Math.random(),
      text: '',
      createdAt: time,
      createdTime: time,

      user: { _id: userName },
      image: result.uri     //"data:image/png;base64," + result.base64,
    }

    setMessages(pre => { return [...pre, { ...imageMsg, isLocal: true }] })
    const folderUri = FileSystem.documentDirectory + "MessageFolder/" + item.name + "/"
    const fileUri = folderUri + item.name + "---" + imageMsg.createdTime
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ ...imageMsg, isLocal: true }))


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









