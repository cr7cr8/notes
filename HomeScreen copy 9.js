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


    this.transY = 0;


    this.state = {
      panelScale: 1
    }
  }


  setPanelScale = (value) => {

    this.setState(state => {

      return state.panelScale = value
    })
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
        allPanelsRef={this.props.allPanelsRef}
        panelScale={this.state.panelScale}
        setPanelScale={this.setPanelScale}
      />


    )
  }

}


function SinglePanel_({
  item,
  panelScale,
  setPanelScale,
  setMainEnabled,
  setListRefEnabled,
  mainRef,
  listRef,
  scrollY,
  mainEnabled,
  allPanelsRef }) {






  const transY = useSharedValue(0)
  const zIndex = useSharedValue(0)

  //const panelScale_ = useSharedValue(panelScale)





  const panelStyle = useAnimatedStyle(() => {
    return {

      transform: [

        { translateY: transY.value },
        { scale: withTiming(panelScale,200) }
      ],

      zIndex: zIndex.value,

    }
  })







  function show(a) {
    "worklet"
    console.log(a)
  }

  const movingUpLine = 30 + 80
  const movingDownLine = height - 80




  const scrollTo = (initialY, initialTranY, direction = "goUp") => {

    if (enableAutoMoving.value) {
      listRef.current.scrollTo({ x: 0, y: direction === "goUp" ? (scrollY.value - 5) : (scrollY.value + 5), animated: false })
      transY.value = initialTranY + (scrollY.value - initialY)


      setTimeout(() => {
        scrollTo(initialY, initialTranY, direction)
      }, 0);
    }

  }




  const enableAutoMoving = useSharedValue(false)

  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, obj) => {
    
      obj.offsetY = transY.value
      obj.preAbsY = event.absoluteY



      if (panelScale !== 0.8) return

    },
    onActive: (event, obj) => {
      zIndex.value = 10
      if (panelScale !== 0.8) return

      //show(obj.offsetY)


      if (event.absoluteY <= movingUpLine) {

        if (!enableAutoMoving.value) {
          enableAutoMoving.value = true
          runOnJS(scrollTo)(scrollY.value, transY.value, "goUp")
        }

      }
      else if ((event.absoluteY > movingUpLine) && (event.absoluteY < movingDownLine)) {
        enableAutoMoving.value = false

        if (obj.preAbsY <= movingUpLine) {
          obj.offsetY = transY.value - event.translationY
        }
        else if ((obj.preAbsY > movingUpLine) && (obj.preAbsY < movingDownLine)) {

          transY.value = obj.offsetY + event.translationY
        }
        else if (obj.preAbsY >= movingDownLine) {

          obj.offsetY = transY.value - event.translationY

        }

      }
      else if (obj.preAbsY >= movingDownLine) {
        if (!enableAutoMoving.value) {
          enableAutoMoving.value = true
          runOnJS(scrollTo)(scrollY.value, transY.value, "goDown")
        }
      }



      obj.preAbsY = event.absoluteY
    },
    onEnd: (event, obj) => {
      zIndex.value = 0
      enableAutoMoving.value = false
      runOnJS(setMainEnabled)(true)

      if (panelScale !== 0.8) return

    


      transY.value = withTiming(Math.round(transY.value / 80) * 80);

      runOnJS(setPanelScale)(1)
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
            setPanelScale(0.8)
            //   panelScale.value = withTiming(0.8, 200)
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