import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Keyboard, Pressable } from 'react-native';

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
const { View, Text, Image, ScrollView: ScrollV } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Context } from "./ContextProvider"

import { GiftedChat, Bubble, InputToolbar, Avatar as AvatarIcon, Message, Time, MessageContainer, MessageText, SystemMessage, Day, Send, Composer } from 'react-native-gifted-chat'
import { Video, AVPlaybackStatus } from 'expo-av';

export function ChatScreen({ navigation, route, ...props }) {


  const { peopleList, setPeopleList } = useContext(Context)


  const item = route.params.item

  const avatarString = multiavatar(item.name)

  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))


  const [messages, setMessages] = useState([]);

  const inputRef = useRef()
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('transitionStart', (e) => {
  //     inputRef.current.blur()
  //   });

  //   return unsubscribe;
  // });


  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('transitionEnd', (e) => {
  //     inputRef.current.blur()
  //   });

  //   return unsubscribe;
  // });


  useEffect(() => {
    setMessages([

      {
        _id: Math.random(),
        text: '1111\nfewfhkl \n就看了附件为 、jiofew \n好就好看附件为全额',
        createdAt: Date.now() + 1000 * 60,
        user: {
          _id:Math.random(),
          name: 'React Native',
         // avatar: () => (<SvgUri style={{ position: "relative", }} width={60} height={60} svgXmlData={multiavatar(item.name, false)} />),
          avatar: () => (<SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />),
        },
        //  video: 'https://vimeo.com/311983548',
      },





      {

        _id: Math.random(),
        text: '333',
        createdAt: Date.now() + 2000 * 60 + 100,
        user: {
          _id: Math.random(),
          name: 'React Native',
          avatar: () => (<SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />),//'https://placeimg.com/140/140/any',
        },
        //image: 'https://picsum.photos/200/300',
        // You can also add a video prop:

        video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',

        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,

      },


      {

        _id: Math.random(),
        text: '4444',
        createdAt: Date.now() + 2000 * 60 + 200,
        user: {
          _id: Math.random(),
          name: 'React Native',
          avatar: () => (<SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />),//'https://placeimg.com/140/140/any',
        },
        image: 'https://picsum.photos/200/300',
        // You can also add a video prop:
          video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,

      },
      {

        _id: Math.random(),
        text: '4444',
        createdAt: Date.now() + 2000 * 60 + 200,
        user: {
          _id: 1,
          name: 'React Native',
          avatar: () => (<SvgUri style={{ position: "relative", }} width={36} height={36} svgXmlData={multiavatar(item.name, false)} />),//'https://placeimg.com/140/140/any',
        },
        image: 'https://picsum.photos/200/300',
        // You can also add a video prop:
        //  video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,

      }


    ])
  }, [])
  const onSend = (messages) => {

    // console.log(messages)


    setMessages(previousMessages => {


      return GiftedChat.prepend(previousMessages, messages)




    }
    )
  }



  // useEffect(function(){

  // console.log(inputRef.current)

  // })

  const [inputText, setInputText] = useState("")
  const [status, setStatus] = React.useState({});
  return (

    <>

      <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: bgColor, padding: 0, elevation: 1, position: "relative" }}>

        {/* <View style={{ position: "absolute", left: 0 }}>
          <Button title="back" onPress={function () {
            //  inputRef.current.blur()

            inputRef.current.blur()
            //   navigation.goBack()
            // setTimeout(() => {
            //  navigation.goBack()
            //  }, 0);


          }} />
        </View> */}


        <SharedElement id={item.name} style={{ transform: [{ scale: 0.58 }], }}   >
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

        messagesContainerStyle={{
          //backgroundColor: "yellow",
          display: "flex", justifyContent: "flex-start",
          alignItems: "flex-start", flexDirection: "row", alignSelf: "flex-start",
          margin: 0, padding: 0,

        }}

        // minComposerHeight={0}
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

        renderMessage={function (props) {


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

          return (
            <ScaleView>
              <Bubble {...props}
                wrapperStyle={{

                  left: {
                    backgroundColor: bgColor,
                    justifyContent: 'flex-start',
                  },
                  right: {
                    backgroundColor: "lightgreen",
                    transform:[{translateX:-16}]
                  },

                }}
                textStyle={{ right: { color: "black" } }}
              />
            </ScaleView>

          )
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
        renderSend={function (props) {
          return <Send {...props} textStyle >
            <View style={{ borderRadius: 1000, height: "100%", width: 50, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon
                name={inputText ? 'send' : 'plus'}
                type={inputText ? 'material' : 'evilicon'}
                color='#517fa4'
                size={inputText ? 30 : 40}
              //    containerStyle={{backgroundColor:'#517fa4',}}
              />
            </View>
          </Send>

        }}



        keyboardShouldPersistTaps={"never"}

        renderComposer={function (props) {
          return (
            <Composer {...props}
              textInputProps={{
                onPressIn: function () { inputRef.current.blur(); inputRef.current.focus() },
                onPressOut: function () { inputRef.current.blur(); },
                ref: function (element) { inputRef.current = element }

              }} />

          )








        }}


        text={inputText}
        onInputTextChanged={text => setInputText(text)}

        onSend={function (messages) {

          setMessages(previousMessages => {
            return GiftedChat.prepend(previousMessages, messages)
          })

        }}





        renderInputToolbar={function (props) {
          //  console.log(props)
          return (<InputToolbar {...props} />)


        }}

        onPressActionButton={function () {
          alert("fdsf")
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

        user={{ _id: 1, }}

      />

    </>
  )
}


ChatScreen.sharedElements = (route, otherRoute, showing) => [


  { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },

  // { id: route.params.item.name + "-logo", animation: "move", resize: "clip", align: 'left-center', },
  // { id: route.params.item.key, animation: "move", resize: "clip", align: 'left-center', },
  // { id: "111", animation: "fade", resize: "auto", align: 'left-center', },
  // { id: "222", animation: "fade", resize: "auto", align: 'left-center', },
  // { id: "333", animation: "fade", resize: "auto", align: 'left-center', },

  // { id: "444", animation: "fade", resize: "auto", align: 'left-center', },

  // { id: "555", animation: "resize", resize: "clip", align: 'left-center', },





];

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
    <View style={scaleStyle}>
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


