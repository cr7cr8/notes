import React, { useState, useRef, useEffect, useContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';

import * as FileSystem from 'expo-file-system';
import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback,


  //ScrollView,
  Vibration
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


import url from "./config";
import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";
import axios from 'axios';


function uniqByKeepFirst(a, key) {
  let seen = new Set();
  return a.filter(item => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}



export function HomeScreen({ navigation, route }) {


  const { peopleList, setPeopleList, token, userName, initialRouter, setInitialRouter } = useContext(Context)


  const [mainEnabled, setMainEnabled] = useState(true)

  //const [inMoving, setInMoving] = useState(false)

  const mainRef = useRef()



  const listRef1 = useRef()
  const listRef2 = useRef()
  const listRef3 = useRef()


  const allPanelArr = useRef([])

  const scrollX = useSharedValue(0)
  const scrollY = useSharedValue(0)

  const [refresh, setRefresh] = useState(true)

  useEffect(function () {

    // setRefresh(pre => !pre);

    axios.get(`${url}/api/user/fetchuserlist`, { headers: { "x-auth-token": token } }).then(response => {

      if (initialRouter === "Reg") {
        let arr = response.data //.filter(item => { return item.name !== userName })
        HomeScreen.sharedElements = null

        setPeopleList(pre => {
          return uniqByKeepFirst([...pre, ...arr], function (item) { return item.name })
        })
        route.params && route.params.item.localImage && FileSystem.deleteAsync(route.params.item.localImage, { idempotent: true })
      }
      else if (initialRouter === "Home") {
        setPeopleList(pre => { return response.data })
      }

    })


  }, [])

  // if ((peopleList.length === 0) && Boolean(route.params) && Boolean(route.params.item)) {

  //   const item = route.params.item
  //   return (
  //     <SharedElement id={item.name}  >
  //       {item.hasAvatar
  //         ? <Image source={{ uri: `${url}/api/image/avatar/${item.name}` }} resizeMode="cover" style={{ margin: 10, width: 60, height: 60, borderRadius: 1000 }} />
  //         : <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
  //       }



  //     </SharedElement>
  //   )
  // }
  return (

    <ScrollView
      //contentOffset={{x:100,y:0}}
      ref={mainRef}
      scrollEnabled={mainEnabled}
      decelerationRate={"fast"}
      snapToInterval={width}
      horizontal={true}

      onScroll={function (e) { scrollX.value = e.nativeEvent.contentOffset.x; }}
    >


      <ScrollView
        //StickyHeaderComponent={() => { return <Text>aaa</Text> }}
        // stickyHeaderIndices={[7]}


        ref={listRef1}

        scrollEnabled={mainEnabled}
        contentContainerStyle={{
          // width,  minHeight: height - 60,
          justifyContent: 'flex-start',
          flexGrow: 1,
          backgroundColor: "wheat",

        }}
        onScroll={function (e) { scrollY.value = e.nativeEvent.contentOffset.y; }}
      >

        {peopleList.map((item, index) => {
          return (
            <SinglePanel
              key={item.key}
              item={item}

              mainEnabled={mainEnabled}
              setMainEnabled={setMainEnabled}

              mainRef={mainRef}
              listRef={listRef1}
              allPanelArr={allPanelArr}

              scrollX={scrollX}
              scrollY={scrollY}
              index={index}
              setPeopleList={setPeopleList}

              // inMoving={inMoving}
              // setInMoving={setInMoving}

              navigation={navigation}
              route={route}

            />
          )


        })}



      </ScrollView>







      <ScrollView ref={listRef2} scrollEnabled={mainEnabled} style={{ width, backgroundColor: "skyblue" }}>
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

    this.state = {

      panelTransX: 0,
      panelTransY: 0,


      panelIndex: this.props.index,

    }

    this.hasAvatar = this.props.item.hasAvatar
    this.name = this.props.item.name
    this.description = this.props.item.description

    this.panelKey = this.props.item.key


    this.moveUpEnabled = false;
    this.moveDownEnabled = false;

  }

  getPanelIndex = () => { return this.state.panelIndex }
  setPanelIndex = (value) => { this.setState({ panelIndex: value }) }

  moveUp = () => {

    if (this.moveUpEnabled) {
      this.moveUpEnabled = false;
      this.moveDownEnabled = true;

      this.setState((state) => { return { panelTransY: state.panelTransY - 80, } })
    }
  }

  moveDown = () => {

    if (this.moveDownEnabled) {
      this.moveUpEnabled = true;
      this.moveDownEnabled = false;
      this.setState((state) => { return { panelTransY: state.panelTransY + 80, } })
    }
  }




  componentDidMount() {
    this.props.allPanelArr.current.push(this)
  }
  componentWillUnmount() {
    this.props.allPanelArr.current = this.props.allPanelArr.current.filter(item => {
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

        scrollX={this.props.scrollX}
        scrollY={this.props.scrollY}
        mainEnabled={this.props.mainEnabled}

        // bgColor={this.bgColor}
        // panelIndex={this.panelIndex}

        panelKey={this.panelKey}

        getPanelIndex={this.getPanelIndex}
        setPanelIndex={this.setPanelIndex}

        panelTransX={this.state.panelTransX}
        panelTransY={this.state.panelTransY}

        allPanelArr={this.props.allPanelArr}

        setPeopleList={this.props.setPeopleList}
        self={this}

        //  inMoving={this.props.inMoving}
        //  setInMoving={this.props.setInMoving}


        navigation={this.props.navigation}
        route={this.props.route}


      />


    )
  }

}


function SinglePanel_({ item, setMainEnabled, setListRefEnabled, mainRef, listRef, scrollX, scrollY, mainEnabled,
  //bgColor,

  // panelIndex,
  panelKey,
  getPanelIndex,
  setPanelIndex,

  panelTransX,
  panelTransY,
  allPanelArr,

  self,
  setPeopleList,

  navigation,
  route,

  // inMoving,
  // setInMoving,

}) {



  const { token } = useContext(Context)

  const avatarString = multiavatar(item.name)



  //const transY = useSharedValue(0)
  const transY = useDerivedValue(() => (withTiming(panelTransY)))


  //const [holding,setHolding] = useState(false)







  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  //console.log(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))



  const zIndex = useSharedValue(0)

  const frameStyle = useAnimatedStyle(() => {


    return {
      width,
      height: 80,
      zIndex: zIndex.value,
      transform: [{ translateY: transY.value }],
      position: "relative",
    }


  })



  const coverTransX = useDerivedValue(() => (withTiming(panelTransX)))
  const coverBgcolor = useSharedValue("white")
  const coverOpacity = useSharedValue(1)

  const coverPanelStyle = useAnimatedStyle(() => {
    return {

      width,
      height: 80,

      transform: [{ translateX: coverTransX.value }],
      // opacity: interpolate(coverTransX.value, [0, width], [1, 0], Extrapolate.CLAMP),                         //coverOpacity.value,
      // opacity:coverOpacity.value,

      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",

      borderBottomWidth: 1,
      borderBottomColor: "#DDD",
      //   position: "absolute",
      backgroundColor: coverBgcolor.value,
      // zIndex: 8,
      // elevation:1,

    }
  })


  function scrollToNextPanel() {
    mainRef.current.scrollTo({ x: width, y: 0, animated: true })
  }



  const timeout = useRef(0)


  function setCountingDown() {
    timeout.current = setTimeout(() => {
      coverTransX.value = withTiming(0)
      backScale.value = withTiming(1)
    }, 3000)

    // console.log(timeout.current)

  }

  function clearCountingDown() {

    timeout.current && clearTimeout(timeout.current)
  }


  const coverGesture = useAnimatedGestureHandler({

    onStart: (event, obj) => {

      runOnJS(settingMovePermission)()

    },
    onActive: (event, obj) => {


      if ((event.translationX > 0) && (coverTransX.value !== 0 || Math.abs(event.translationY) < 5)) {
        zIndex.value = 10
        coverTransX.value = event.translationX

      }
      else if ((event.translationX < -50) && (coverTransX.value === 0 || Math.abs(event.translationY) < 5)) {


        runOnJS(scrollToNextPanel)()
      }


    },
    onEnd: (event, obj) => {

      if (coverTransX.value >= 80) {

        coverTransX.value = withTiming(width)
        runOnJS(setCountingDown)()

      }
      else {
        coverTransX.value = withTiming(0)
        zIndex.value = 0

      }

    },
    onFail: (event, obj) => {

      coverTransX.value = withTiming(0)

    },
    onCancel: (event, obj) => {

      coverTransX.value = withTiming(0)

    },
    onFinish: (event, obj) => {

    }

  })



  function show(a) {
    "worklet"
    console.log(a)
  }

  const enableAutoMoving = useSharedValue(false)
  function scrollTo(initialScrollY, initialTranY, direction = "goUp") {

    if (enableAutoMoving.value) {
      listRef.current.scrollTo({ x: 0, y: direction === "goUp" ? (scrollY.value - 5) : (scrollY.value + 5), animated: false })
      transY.value = initialTranY + (scrollY.value - initialScrollY)


      setTimeout(() => {
        scrollTo(initialScrollY, initialTranY, direction)
      }, 0)
    }
    else {
      transY.value = withTiming(Math.round(transY.value / 80) * 80)

    }
  }

  function settingMovePermission() {


    const panelIndex = getPanelIndex()
    allPanelArr.current.forEach((panel) => {

      const otherPanelIndex = panel.getPanelIndex()

      if (otherPanelIndex < panelIndex) {
        panel.moveUpEnabled = false;
        panel.moveDownEnabled = true;
      }
      else if (otherPanelIndex > panelIndex) {
        panel.moveUpEnabled = true;
        panel.moveDownEnabled = false;
      }
    })

  }


  function checkingMovement() {

    const panelIndex = getPanelIndex()


    allPanelArr.current.forEach((panel) => {

      const otherPanelIndex = panel.getPanelIndex()
      if (otherPanelIndex === panelIndex) { return }
      else if (transY.value <= ((otherPanelIndex - panelIndex) * 2 - ((otherPanelIndex - panelIndex) > 0 ? 1 : -1)) * 40) { panel.moveDown(); }
      else { panel.moveUp() }
    })
  }


  function reSortList() {

    const panelIndex = getPanelIndex()
    const from = panelIndex
    const to = panelIndex + Math.min((allPanelArr.current.length - (panelIndex + 1)), Math.max(-panelIndex, Math.round(transY.value / 80)))

    // if (from === to) { return setTimeout(() => { setPanEnabled(true) }, 0); }


    allPanelArr.current = moveArr(allPanelArr.current, from, to)
    const newList = []

    allPanelArr.current.forEach((panel, index) => {
      newList.push({ ...panel.props.item, name: panel.name, description: panel.description, key: Math.random(), hasAvatar: panel.hasAvatar })
    })
    allPanelArr.current = []

    axios.post(`${url}/api/user/resortuserlist`, newList.map(item => item.name), { headers: { "x-auth-token": token } })


    setPeopleList(newList)
    //  setTimeout(() => { setPanEnabled(true) }, 0); // no need beackuse setPeopleList will  generate new panel painting

  }


  const backScale = useSharedValue(1)
  const backPanelStyle = useAnimatedStyle(() => {
    return {


      width,
      height: 80,
      // elevation:1,

      borderBottomWidth: 1,
      borderBottomColor: "#DDD",
      position: "absolute",
      backgroundColor: bgColor,
      //   zIndex: 5,

      transform: [{ scale: backScale.value }],
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",


    }
  })


  const movingUpLine = 60 + 40
  const movingDownLine = height - 80
  const [panEnabled, setPanEnabled] = useState(true)



  const backGesture = useAnimatedGestureHandler({


    onStart: (event, obj) => {


      obj.offsetY = transY.value
      obj.preAbsY = event.absoluteY

      zIndex.value = 10
      backScale.value = withTiming(0.8)

      runOnJS(settingMovePermission)()

    },
    onActive: (event, obj) => {
      runOnJS(clearCountingDown)()

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


      runOnJS(checkingMovement)()
      obj.preAbsY = event.absoluteY

    },
    onEnd: (event, obj) => {



      enableAutoMoving.value = false
      const v = Math.round(transY.value / 80) * 80
      transY.value = withTiming(v)

      coverTransX.value = withTiming(0)
      backScale.value = withTiming(1)

      zIndex.value = 0
      runOnJS(setPanEnabled)(false)
      runOnJS(reSortList)()


      obj.preAbsY = event.absoluteY
    },
    onFail: (event, obj) => {

    },
    onCancel: (event, obj) => {

    },
    onFinish: (event, obj) => {

    }

  })



  //console.log(item.localImage)


  return (
    <>

      <View style={frameStyle} >



        <PanGestureHandler maxPointers={1} onGestureEvent={backGesture} >
          <View style={[backPanelStyle]}>
            <Icon
              //     containerStyle={{width:width/3}}
              name="drag-horizontal"
              type='material-community'
              color='#517fa4'
              size={60}
            />
            {item.hasAvatar
              ? <Image source={{ uri: `${url}/api/image/avatar/${item.name}` }}
                resizeMode="cover"
                style={{ position: "absolute", right: 10, width: 60, height: 60, borderRadius: 1000 }} />
              : <SvgUri style={{ position: "absolute", right: 10 }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
            }
            <View style={{ width: width / 3, position: "absolute", left: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </View>
          </View>
        </PanGestureHandler>


        <Pressable

          onPressIn={function () {

            coverBgcolor.value = bgColor

          }}

          onPress={function () {
            coverTransX.value === 0 && navigation.navigate('Chat', { item: self.props.item })
          }}

          onPressOut={function () {
            coverBgcolor.value = "white"
          }}
        >
          <PanGestureHandler

            enabled={panEnabled}
            minPointers={1} shouldCancelWhenOutside={true} //simultaneousHandlers={[mainRef, listRef]}
            simultaneousHandlers={[listRef]}


            onGestureEvent={coverGesture} >



            <View style={[coverPanelStyle]}   >
              {/* <Pressable onPress={function () { console.log("dddsdsd") }}> <View > */}
              <Badge
                status="error"
                containerStyle={{ position: 'absolute', top: 10, left: 60, transform:[{scale:0}], zIndex:100 }}
              />
              <SharedElement id={item.name}  >
                {item.hasAvatar
                  ? <Image source={{ uri: item.localImage || `${url}/api/image/avatar/${item.name}` }} resizeMode="cover" style={{ margin: 10, width: 60, height: 60, borderRadius: 1000 }} />
                  : <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
                }



              </SharedElement>
              <Text style={{ fontSize: 20 }}>{item.name}</Text>


              {/* </View> </Pressable>*/}
            </View>
          </PanGestureHandler>
        </Pressable>








      </View>
      <Overlay isVisible={!panEnabled && allPanelArr.current.length > 7} fullScreen={true} overlayStyle={{ opacity: 0.5, display: "flex", justifyContent: "center", alignItems: "center" }}  >
        <LinearProgress color="primary" value={1} variant={"indeterminate"} />
        <Text>Processing...</Text>
      </Overlay>
    </>
  )


}





HomeScreen.sharedElements = (route, otherRoute, showing) => {


  return route.params && route.params.item && route.params.item.name && [
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", }, // ...messageArr,   // turn back image transition off
  ]
};








function moveArr(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    let k = new_index - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}




/* <LinearProgress color="primary" style={{position:"absolute"}}/> */
function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.3)';
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
