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
  { name: "sfewf", description: "fewfas", key: Math.random() },
  { name: "sfe的wf", description: "fewf的话就开始as", key: Math.random() },
  { name: "sf繁多ewf", description: "fewfas", key: Math.random() },
  { name: "sf但是ewf", description: "fewfas", key: Math.random() },
  { name: "sf  飞wf", description: "fewfas", key: Math.random() },
  { name: "sfewf", description: "fewfas", key: Math.random() },
  { name: "sfew但是f", description: "fewfas", key: Math.random() },
  { name: "sfewf", description: "as是as", key: Math.random() },
  { name: "sfe 是wf", description: "fewfas", key: Math.random() },
  { name: "sfewf", description: "fewfas", key: Math.random() },
  { name: "s但是fewf", description: "fewfas", key: Math.random() },
  { name: "sfewf", description: "fewfas", key: Math.random() },
  { name: "sf似的 ewf", description: "fewfas", key: Math.random() },
  { name: "就看fewf", description: "s ewfas", key: Math.random() },
  { name: "ewf", description: "fewd fas", key: Math.random() },
  { name: "sfewf", description: "feds wfas", key: Math.random() },
  { name: "ewf", description: "few dfas", key: Math.random() },



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

  const allPanelArr = useRef([])

  const scrollY = useSharedValue(0)

  const [refresh, setRefresh] = useState(true)


  const [peoplelist, setPeopleList] = useState(list)



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


        {peoplelist.map((item, index) => {

          return (
            <SinglePanel
              key={item.key}
              item={item}
              mainEnabled={mainEnabled}
              setMainEnabled={setMainEnabled}
              setListRefEnabled={setListRef1Enabled}
              mainRef={mainRef}
              listRef={listRef1}
              allPanelArr={allPanelArr}
              scrollY={scrollY}
              index={index}
              setPeopleList={setPeopleList}
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

    this.state = {
      panelTransY: 0,
    }



    this.panelKey = this.props.item.key
    this.panelIndex = this.props.index

    this.moveUpEnabled = false;
    this.moveDownEnabled = false;

  }

  getPanelIndex = () => { return this.panelIndex }
  setPanelIndex = (value) => { this.panelIndex = value }

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
        scrollY={this.props.scrollY}
        mainEnabled={this.props.mainEnabled}

        bgColor={this.bgColor}


        // panelIndex={this.panelIndex}

        panelKey={this.panelKey}

        getPanelIndex={this.getPanelIndex}
        setPanelIndex={this.setPanelIndex}

        panelTransY={this.state.panelTransY}
        allPanelArr={this.props.allPanelArr}

        setPeopleList={this.props.setPeopleList}

      />


    )
  }

}


function SinglePanel_({ item, setMainEnabled, setListRefEnabled, mainRef, listRef, scrollY, mainEnabled, bgColor,

  // panelIndex,
  panelKey,
  getPanelIndex,
  setPanelIndex,
  panelTransY,
  allPanelArr,

  setPeopleList,
}) {





  //const transY = useSharedValue(0)
  const transY = useDerivedValue(() => (withTiming(panelTransY)))




  const zIndex = useSharedValue(0)

  const panelScale = useSharedValue(1)
  const elevation = useSharedValue(0)




  const panelStyle = useAnimatedStyle(() => {
    return {

      transform: [

        { translateY: transY.value },
        { scale: panelScale.value }
      ],

      zIndex: zIndex.value,

    }
  })


  const frameStyle = useAnimatedStyle(() => {
    return {

      width,
      height: 80,
      backgroundColor: "white",
      display: "flex",
      justifyContent: "flex-start",

      alignItems: "center",
      flexDirection: "row",
      elevation: elevation.value,

    }
  })




  function show(a) {
    "worklet"
    console.log(a)
  }

  const movingUpLine = 30 + 80
  const movingDownLine = height - 80



  function scrollTo(initialY, initialTranY, direction = "goUp") {
    // timeout && clearTimeout(timeout)
    if (enableAutoMoving.value) {
      listRef.current.scrollTo({ x: 0, y: direction === "goUp" ? (scrollY.value - 5) : (scrollY.value + 5), animated: false })
      transY.value = initialTranY + (scrollY.value - initialY)
      // transY.value = withTiming(initialTranY + (scrollY.value - initialY))
      setTimeout(() => {
        scrollTo(initialY, initialTranY, direction)
      }, 0)
    }
    else {
      transY.value = withTiming(Math.round(transY.value / 80) * 80)
      //  timeout && clearTimeout(timeout)
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
      if (transY.value <= ((otherPanelIndex - panelIndex) * 2 - ((otherPanelIndex - panelIndex) > 0 ? 1 : -1)) * 40) { panel.moveDown() }
      else { panel.moveUp() }






    })
  }


  function reSortList(value) {




    const panelIndex = getPanelIndex()


    setMainEnabled(true)



    const from = panelIndex
    const to = panelIndex + Math.min((allPanelArr.current.length - (panelIndex + 1)), Math.max(-panelIndex, Math.round(transY.value / 80)))



    allPanelArr.current = []
    setPeopleList((peoplelist) => {

      peoplelist.forEach((item, index) => {
        item.key = Math.random()
      })
      return moveArr(peoplelist, from, to)
    })




  }





  const enableAutoMoving = useSharedValue(false)


  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, obj) => {

      obj.offsetY = transY.value
      obj.preAbsY = event.absoluteY
      runOnJS(settingMovePermission)()


      if (panelScale.value !== 0.8) return
      // if ((panelScale.value !== 0.8) && (!mainEnabled)) {
      //   runOnJS(setMainEnabled)(true)
      // } 
    },
    onActive: (event, obj) => {
      zIndex.value = 10
      if (panelScale.value !== 0.8) return

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
      runOnJS(checkingMovement)()
    },
    onEnd: (event, obj) => {
      //    zIndex.value = 0
      // runOnJS(setMainEnabled)(true)

      enableAutoMoving.value = false
      const v = Math.round(transY.value / 80) * 80



      transY.value = withTiming(v)
      panelScale.value = withTiming(1)
      elevation.value = withTiming(0)



      runOnJS(reSortList)(v)


      obj.preAbsY = event.absoluteY
    },
    onFail: (event, obj) => {

    },
    onCancel: (event, obj) => {

    },
    onFinish: (event, obj) => {





    }

  })






  return (


    <PanGestureHandler

      maxPointers={1}
      onGestureEvent={gestureHandler}

      // enabled={!mainEnabled}
      enabled={true}
      simultaneousHandlers={[mainRef, listRef]}
    //  waitFor={listRef}
    // simultaneousHandlers={mainRef}

    >
      <View style={[panelStyle]}>
        <TouchableOpacity activeOpacity={0.5}
          style={{ zIndex: zIndex.value }}
          onLongPress={function () {


            console.log(Date.now())

            mainEnabled && setMainEnabled(pre => {


              return false

            })

            panelScale.value = withTiming(0.8)
            elevation.value = withTiming(15)


            //  panelScale.value =withDelay(100, withTiming(0.8,100))
            //  elevation.value = withDelay(100, withTiming(15,100))



            //  panelScale.value = 0.8
          }}


        >

          <View style={[frameStyle, { borderBottomWidth: 1, borderBottomColor: "#DDD" }]}  >

            <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(item.name)} />
            <Text>{item.name}</Text>
            {/* <ListItem
            bottomDivider={true}
            containerStyle={[{ elevation: 0, padding: 10, },]}


          >
            <SvgUri width={60} height={60} svgXmlData={multiavatar(item.name)} />
            <ListItem.Content >
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
            </ListItem.Content>



          </ListItem> */}

          </View>
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