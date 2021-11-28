import React, { useState, useRef, useEffect } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, } from 'react-native';

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


const list = [
  { name: "sfewf", description: "fewfas" },
  { name: "sfe的wf", description: "fewf的话就开始as" },
  { name: "sf繁多ewf", description: "fewfas" },
  { name: "sf但是ewf", description: "fewfas" },
  { name: "sf  飞wf", description: "fewfas" },
  { name: "sfewf", description: "fewfas" },
  { name: "sfew但是f", description: "fewfas" },
  { name: "sfewf", description: "as是as" },
  { name: "sfe 是wf", description: "fewfas" },
  { name: "sfewf", description: "fewfas" },
  { name: "s但是fewf", description: "fewfas" },
  { name: "sfewf", description: "fewfas" },
  { name: "sf似的 ewf", description: "fewfas" },
  { name: "就看fewf", description: "s ewfas" },
  { name: "ewf", description: "fewd fas" },
  { name: "sfewf", description: "feds wfas" },
  { name: "ewf", description: "few dfas" },



]

export function HomeScreen({ navigation, route }) {

  const [mainEnabled, setMainEnabled] = useState(true)



  const mainRef = useRef()

  //const [listRef1,setListRef1] = useState()

  const listRef1 = useRef()
  const listRef2 = useRef()
  const listRef3 = useRef()

  const [listRef1Enabled, setListRef1Enabled] = useState(true)
  const [listRef2Enabled, setListRef2Enabled] = useState(true)
  const [listRef3Enabled, setListRef3Enabled] = useState(true)

  const allPanelsRef = useRef([])

  const scrollY = useSharedValue(0)

  const [refresh, setRefresh] = useState(true)

  //const scrollY = useRef(0)

  // useEffect(function () {

  //  // console.log("---", listRef1.current)
  //   //console.log(simultaneousHandlers.current)
  // })

  useEffect(function () {
    setRefresh(pre => !pre)

  }, [])




  return (

    <ScrollView
      //contentOffset={{x:100,y:0}}
      enabled={mainEnabled}
      decelerationRate={"fast"}
      snapToInterval={width}
      horizontal={true}
      ref={mainRef}

    >

      <ScrollView


        ref={listRef1}


        enabled={mainEnabled}
        style={{ width, backgroundColor: "pink" }}

        onScroll={function (e) {
          scrollY.value = e.nativeEvent.contentOffset.y;
          //console.log(scrollY.value) 
        }}


      >


        {list.map((item, index) => {

          return (
            <SinglePanel
              key={index}
              item={item}
              mainEnabled={mainEnabled}
              setMainEnabled={setMainEnabled}
              setListRefEnabled={setListRef1Enabled}
              mainRef={mainRef}
              listRef={listRef1}
              allPanelsRef={allPanelsRef}
              scrollY={scrollY}
            />
          )


        })}



      </ScrollView>


      <ScrollView ref={listRef2} enabled={mainEnabled} style={{ width, backgroundColor: "skyblue" }}>
        <Text>asdf</Text>

      </ScrollView>
      {/* 

      <ScrollView ref={listRef3} enabled={mainEnabled} style={{ width, backgroundColor: "lightgreen" }}>
        <Text>asdf</Text>
      
      </ScrollView> */}

    </ScrollView>


  )




}


class SinglePanel extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.allPanelsRef.current.push(this)
  }
  componentWillUnmount() {
    this.props.allPanelsRef.current = this.props.allPanelsRef.current.filter(item => {
      return item !== this
    })

  }



  render() {
    //  console.log("===", this.props.listRef)
    return (

      <SinglePanel_
        item={this.props.item}
        setMainEnabled={this.props.setMainEnabled}
        setListRefEnabled={this.props.setListRefEnabled}
        mainRef={this.props.mainRef}
        listRef={this.props.listRef}
        scrollY={this.props.scrollY}
        mainEnabled={this.props.mainEnabled}
      />


    )
  }

}


function SinglePanel_({ item, setMainEnabled, setListRefEnabled, mainRef, listRef, scrollY, mainEnabled }) {




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


  const enableAutoMoving = useSharedValue(false)




  function show(a) {
    //"worklet"
    console.log(a)
  }

  const movingUpLine = 60 + 80 + 40
  const movingDownLine = height - 80



  const scrollTo = () => {

    if (listRef.current) { listRef.current.scrollTo({ x: 0, y: scrollY.value + 5, animated: true }) }

    setTimeout(() => {
      scrollTo()
    }, 100);


  }

  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, obj) => {


      if (panelScale.value !== 0.8) return


      obj.preAbsY = event.absoluteY
    },
    onActive: (event, obj) => {
      zIndex.value = 10
      if (panelScale.value !== 0.8) return
      transY.value = preTransY.value + event.translationY;

    },
    onEnd: (event, obj) => {
      zIndex.value = 0
      runOnJS(setMainEnabled)(true)
      
      if (panelScale.value !== 0.8) return
      panelScale.value = withTiming(1)

    



      transY.value = withTiming(Math.round((preTransY.value + event.translationY) / 80) * 80);
      preTransY.value = Math.round((preTransY.value + event.translationY) / 80) * 80;
     



      obj.preAbsY = event.absoluteY
    },
    onFail: (event, obj) => {

    },
    onCancel: (event, obj) => {

    },

  })






  return (


    <PanGestureHandler

      maxPointers={1}
      onGestureEvent={gestureHandler}

      //enabled={!mainEnabled}
      enabled={true}
      simultaneousHandlers={[mainRef, listRef]}
    //  waitFor={listRef}
    // simultaneousHandlers={mainRef}

    >

      <View style={[panelStyle]}
        onTouchStart={function () {
          //   alert("ff")
        }}

      >
        <TouchableOpacity activeOpacity={0.5}
          style={{ zIndex: zIndex.value }}
          onLongPress={function () {

            setMainEnabled(false)
            panelScale.value = withTiming(0.8, 200)
            // panelScale.value = withTiming(0.8, 200)

            //scrollTo()

          }}


        >
          <ListItem
            bottomDivider={true}
            containerStyle={[{ elevation: 3, padding: 10, },]}


          >
            <SvgUri width={60} height={60} svgXmlData={multiavatar(item.name)} />
            <ListItem.Content >
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
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