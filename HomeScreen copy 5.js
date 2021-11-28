import React, { useState, useRef, useEffect } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Button, Dimensions, TouchableOpacity, TouchableNativeFeedback, } from 'react-native';

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
const { View, Text, Image, /*ScrollView*/ } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';

export function HomeScreen({ navigation, route }) {

  const [mainEnabled, setMainEnabled] = useState(true)

  const mainRef = useRef()

  const listRef1 = useRef()
  const listRef2 = useRef()
  const listRef3 = useRef()

  const [listRef1Enabled, setListRef1Enabled] = useState(true)
  const [listRef2Enabled, setListRef2Enabled] = useState(true)
  const [listRef3Enabled, setListRef3Enabled] = useState(true)


  useEffect(function () {


    //console.log(simultaneousHandlers.current)
  })



  return (

    <ScrollView
      //contentOffset={{x:100,y:0}}
      enabled={mainEnabled}
      decelerationRate={"fast"}
      snapToInterval={width}
      horizontal={true}
      ref={mainRef}
    >

      <ScrollView ref={listRef1} enabled={mainEnabled} style={{ width, backgroundColor: "pink" }}>
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef1Enabled} mainRef={mainRef} listRef={listRef1} />



      </ScrollView>


      <ScrollView ref={listRef2} enabled={mainEnabled} style={{ width, backgroundColor: "skyblue" }}>
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef2Enabled} mainRef={mainRef} listRef={listRef2} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef2Enabled} mainRef={mainRef} listRef={listRef2} />
      </ScrollView>


      <ScrollView ref={listRef3} enabled={mainEnabled} style={{ width, backgroundColor: "lightgreen" }}>
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef3Enabled} mainRef={mainRef} listRef={listRef3} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef3Enabled} mainRef={mainRef} listRef={listRef3} />
        <SinglePanel setMainEnabled={setMainEnabled} setListRefEnabled={setListRef3Enabled} mainRef={mainRef} listRef={listRef3} />
      </ScrollView>

    </ScrollView>


  )




}


class SinglePanel extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {

    return (

      <SinglePanel_ setMainEnabled={this.props.setMainEnabled} setListRefEnabled={this.props.setListRefEnabled} mainRef={this.props.mainRef} listRef={this.props.listRef} />


    )
  }

}


function SinglePanel_({ setMainEnabled, setListRefEnabled, mainRef, listRef }) {




  const preTransX = useSharedValue(0)
  const preTransY = useSharedValue(0)

  const transX = useSharedValue(0)
  const transY = useSharedValue(0)


  const zIndex = useSharedValue(0)

  const panelScale = useSharedValue(1)





  const panelStyle = useAnimatedStyle(() => {
    return {
      //  height: 60,
      transform: [
        { translateX: transX.value },
        { translateY: transY.value },
        { scale: panelScale.value }
      ],
      backgroundColor: "#pink",
      // shadowColor: '#ff0000',
      zIndex: zIndex.value,

    }
  })

  const shadowStyle = useAnimatedStyle(() => {
    return {
      elevation: 10

    }
  })






  function show(a) {
    "worklet"
    console.log(a)
  }



  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, obj) => {
      if (panelScale.value !== 0.8) return
   
    },
    onActive: (event, obj) => {
      if (panelScale.value !== 0.8) return

      transY.value = preTransY.value + event.translationY;
      zIndex.value = 10

    },
    onEnd: (event, obj) => {

      if (panelScale.value !== 0.8) return

      zIndex.value = 0
      preTransY.value = preTransY.value + event.translationY;
      panelScale.value = withTiming(1)

      runOnJS(setMainEnabled)(true)


    },
  })


  return (


    <PanGestureHandler

      maxPointers={1}
      onGestureEvent={gestureHandler}

      enabled={true}
      simultaneousHandlers={[mainRef, listRef]}

    >

      <View style={[panelStyle]}
        onTouchStart={function () {
          //   alert("ff")
        }}

      >
        <TouchableOpacity
          style={{ zIndex: zIndex.value }}
          onLongPress={function () {

            panelScale.value = withDelay(2000, withTiming(0.8, 200))

            setMainEnabled(false)
          }}


        >
          <ListItem
            bottomDivider={true}
            containerStyle={[{ elevation: 3, padding: 10, },]}


          >
            <SvgUri width={60} height={60} svgXmlData={multiavatar(Math.random())} />
            <ListItem.Content >
              <ListItem.Title>{"Amy Farha"}</ListItem.Title>
              <ListItem.Subtitle>{"Vice President"}</ListItem.Subtitle>
            </ListItem.Content>



          </ListItem>
        </TouchableOpacity>
      </View>

    </PanGestureHandler>

  )


}




export function DetailScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <Image source={{ uri: "https://picsum.photos/200/300" }} width={100} height={100} />
      <Text>Detail Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}






const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
// const Base64 = {
//   btoa: (input) => {
//     let str = input;
//     let output = '';

//     for (let block = 0, charCode, i = 0, map = chars;
//       str.charAt(i | 0) || (map = '=', i % 1);
//       output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

//       charCode = str.charCodeAt(i += 3 / 4);

//       if (charCode > 0xFF) {
//         throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
//       }

//       block = block << 8 | charCode;
//     }

//     return output;
//   },

//   atob: (input) => {
//     let str = input.replace(/=+$/, '');
//     let output = '';

//     if (str.length % 4 == 1) {
//       throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
//     }
//     for (let bc = 0, bs = 0, buffer, i = 0;
//       buffer = str.charAt(i++);

//       ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
//         bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
//     ) {
//       buffer = chars.indexOf(buffer);
//     }

//     return output;
//   }
// };


/* <LinearProgress color="primary" style={{position:"absolute"}}/> */