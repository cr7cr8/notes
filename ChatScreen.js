import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable, Vibration, UIManager,findNodeHandle } from 'react-native';

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

import { ListItem, Avatar, LinearProgress, Button, Tooltip } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


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

export function ChatScreen({ navigation, route, ...props }) {

  const item = route.params.item
  const avatarString = multiavatar(item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))


  // const { peopleList, setPeopleList, messageList, setMessages } = useContext(Context)

  // const messages = messageList
  //   .filter(msg => { return msg.user.name === item.name })
  //   .map(msg => {
  //     // <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(msg.user.name, false)} />
  //     return {
  //       ...msg,
  //       user: {
  //         _id: Math.random(),
  //         name: msg.user.name,
  //         avatar: () => <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(msg.user.name, false)} />
  //       }

  //     }
  //   })

  const [messages, setMessages] = useState([])

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




  const [overLayOn, setOverLayOn] = useState(false)
  const [uri, setUri] = useState()


  useEffect(function () {

    setMessages([
      {
        _id: Math.random(),
        text: `111拉克哇\n111拉克Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor
        e magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco lab
        oris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
         nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        createdAt: Date.now() + 1000 * 60,
        user: {
          _id: Math.random(),
          name: 'a',
          avatar: () => <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />
        },
      },
      {
        _id: Math.random(),
        text: '111拉克哇ss',
        createdAt: Date.now() + 1000 * 60 + 5685,
        user: {
          _id: "myself",
          name: 'a',
          avatar: () => <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />
        },
      },

      {
        _id: Math.random(),
        text: '',
        createdAt: Date.now() + 1000 * 60,
        user: {
          _id: Math.random(),
          name: 'e',
          avatar: () => <SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />
        },
        image: 'https://picsum.photos/200/300',
      },

    ])

  }, [])




  return (

    <>

      <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: bgColor, padding: 0, elevation: 1, position: "relative" }}>


        <SharedElement id={item.name} style={{ transform: [{ scale: 0.56 }], }}   >
          <SvgUri style={{ position: "relative", top: getStatusBarHeight() }} width={60} height={60} svgXmlData={avatarString} />

        </SharedElement>


        <Text style={{ position: "relative", fontSize: 20, top: getStatusBarHeight() / 2 }}>{item.name}</Text>

      </View >


      <GiftedChat

        // loadEarlier={true}
        // isLoadingEarlier={true}
        //  messages={[{ _id: 1, text: "11111", user: { _id: 1 } }, { _id: 2, text: "2222", user: { _id: 2 } }].reverse()}
        placeholder="enter..."
        messages={messages}

        alignTop={true}
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
                //    backgroundColor: "skyblue",
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

              <Bubble {...props}

                onLongPress={function () { console.log("long press") }}
                wrapperStyle={{

                  left: {
                    backgroundColor: bgColor,
                    // backgroundColor: currentMessage.image ? bgColor : bgColor,
                    justifyContent: 'flex-start',

                    overflow: "hidden",
                  },
                  right: {
                    // ...!currentMessage.image && { backgroundColor: "lightgreen" },

                    overflow: "hidden",
                    backgroundColor: "lightgreen",
                    //   backgroundColor: currentMessage.image ? "lightgreen" : "lightgreen",
                    transform: [{ translateX: -9 }]
                  },

                }}
                textStyle={{
                  left: { color: "black", ...currentMessage.image && { display: "none" } },

                  right: { color: "black", ...currentMessage.image && { display: "none" } },

                }}
              />

            </ScaleView>


          )
        }}

        renderMessageText={function (props) {

          return <MessageTextBlock {...props} />


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
                onPressIn: function () { inputRef.current.blur(); inputRef.current.focus(); expandWidth.value = 50; },
                onPressOut: function () { inputRef.current.blur(); },
                ref: function (element) { inputRef.current = element }

              }} />

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
                  onPress={function () { pickImage(setMessages) }}
                  name="image-outline"
                  type='ionicon'
                  color='#517fa4'
                  size={inputText ? 0 : 50}
                />


                <Icon
                  onPress={function () { takePhoto(setMessages) }}
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
          setMessages(previousMessages => {
            //  console.log(messages)
            return GiftedChat.prepend(previousMessages, messages)
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
          // console.log((props.currentMessage))

          const imageMessageArr = messages.filter(message => Boolean(message.image)).map(item => { return { ...item, user: { ...item.user, avatar: "" } } })

          return (
            <Pressable

              onLongPress={function () {
                Vibration.vibrate(50);
                setUri(currentMessage.image)
                setOverLayOn(true)
              }}

              onPress={function () {

                navigation.navigate('Image', {

                  item: { name: route.params.item.name },
                  imagePos: imageMessageArr.findIndex(item => { return item._id === currentMessage._id }),
                  messages: imageMessageArr,
                  // setMessages,
                })
              }}>


              <SharedElement id={currentMessage._id}  >

                <Image source={{ uri: props.currentMessage.image, headers: { token: "hihihi" } }} width={200} resizeMode="contain" style={{
                  //  resizeMode: "contain",  // width: 200,  // height: 300
                }} />
              </SharedElement>

            </Pressable>
            //return <MessageImage {...props} />
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

        user={{ _id: "myself", }}

      />






      <OverlayDownloader overLayOn={overLayOn} setOverLayOn={setOverLayOn} uri={uri} fileName={Date.now() + ".jpg"} />

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

function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.2)';
  }
  throw new Error('Bad Hex');
}

function hexify(color) {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  var a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  return "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2);
}





async function pickImage(setMessages) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    // aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if (!result.cancelled) {
    result.uri && setMessages(pre => {
      return [...pre, {
        _id: Math.random(),
        text: '',
        createdAt: Date.now(),
        user: {
          _id: "myself",
          //  name: 'React Native',
          //  avatar: () => (<SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />),//'https://placeimg.com/140/140/any',
        },
        image: result.uri     //"data:image/png;base64," + result.base64,

      },
      ]

    })

  }
};




async function takePhoto(setMessages) {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    //  aspect: [1, 1],
    quality: 1,
    base64: false,
  });



  if (!result.cancelled) {


    const { granted } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
    if (!granted) { return }
    else {

      result.uri && setMessages(pre => {
        return [...pre, {
          _id: Math.random(),
          text: '',
          createdAt: Date.now(),
          user: {
            _id: "myself",
            //name: 'React Native',
            //avatar: () => (<SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />),//'https://placeimg.com/140/140/any',
          },
          image: result.uri // "data:image/png;base64," + result.base64,

        },
        ]

      })
    }
  }

}

function MessageTextBlock(props) {

  const toolTipRef = useRef()
  const viewRef = useAnimatedRef()

  //const [posX,setPosX] = useState(0)

  const textHeight = useRef(0)

  return (
    <>

      <Pressable onLongPress={function () { toolTipRef.current.toggleTooltip() }}>
        <MessageText {...props}
          //  containerStyle={{ right: { backgroundColor: "blue" } }}
          textStyle={{ left: { fontSize: 20, lineHeight: 30, color: "black" }, right: { fontSize: 20, lineHeight: 30, color: "black" } }}

        />
      </Pressable>






      <Tooltip
        toggleAction="onLongPress"
        popover={<Button title="button" onPress={function () { toolTipRef.current.toggleTooltip() }} />}
        height={60}
        containerStyle={{
          padding: 0,
          //  position:"absolute",
          backgroundColor: "pink",
          // top:20,
        }}
        onOpen={function (e) {

          console.log("====")
          UIManager.measure(toolTipRef.current, (x, y, width, height, pageX, pageY) => {
            console.log(y);

          })


          //console.log(Object.keys(e.target))
          //  console.log(e.target.viewConfig)
        }}
        ref={element => { toolTipRef.current = element }}
      >
        <View
          ref={element => { viewRef.current = element }}
          onLayout={function () {

            const handle = findNodeHandle( viewRef.current); 
            UIManager.measure(handle,(fx, fy, width, height, px, py) => {
              console.log('Component width is: ' + width)
              console.log('Component height is: ' + height)
              console.log('X offset to frame: ' + fx)
              console.log('Y offset to frame: ' + fy)
              console.log('X offset to page: ' + px)
              console.log('Y offset to page: ' + py)
          })       


            // viewRef.current.measure((x, y, width, height, pageX, pageY) => {
            //   console.log("===",x,y,width,height)

            //   // resolve({ x, y, width, height, pageX, pageY });
            // });


          }}

        >

        </View>
      </Tooltip>




    </>
  )

}