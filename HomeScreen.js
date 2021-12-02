import React, { useState, useRef, useEffect, useContext } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';

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
const { View, Text, Image, ScrollView: ScrollV, } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
import { PanGestureHandler, ScrollView, FlatList, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { ListItem, Avatar, LinearProgress, Button } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';


import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";


export function HomeScreen({ navigation, route }) {


  const { peopleList, setPeopleList } = useContext(Context)


  const [mainEnabled, setMainEnabled] = useState(true)

  const [inMoving, setInMoving] = useState(false)

  const mainRef = useRef()

  //const [listRef1,setListRef1] = useState()

  const listRef1 = useRef()
  const listRef2 = useRef()
  const listRef3 = useRef()


  const allPanelArr = useRef([])

  const scrollY = useSharedValue(0)

  const [refresh, setRefresh] = useState(true)

  useEffect(function () { setRefresh(pre => !pre) }, [])





  return (

    <ScrollView
      //contentOffset={{x:100,y:0}}
      ref={mainRef}
      scrollEnabled={mainEnabled}
      decelerationRate={"fast"}
      snapToInterval={width}
      horizontal={true}


    >


      <ScrollView
        ref={listRef1}
        scrollEnabled={mainEnabled}
        contentContainerStyle={{
          width,// backgroundColor: "wheat",
          minHeight: height - 60
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

              scrollY={scrollY}
              index={index}
              setPeopleList={setPeopleList}

              inMoving={inMoving}
              setInMoving={setInMoving}

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
      panelTransY: 0,
      panelIndex: this.props.index,

    }


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
        scrollY={this.props.scrollY}
        mainEnabled={this.props.mainEnabled}

        // bgColor={this.bgColor}
        // panelIndex={this.panelIndex}

        panelKey={this.panelKey}

        getPanelIndex={this.getPanelIndex}
        setPanelIndex={this.setPanelIndex}

        panelTransY={this.state.panelTransY}
        allPanelArr={this.props.allPanelArr}

        setPeopleList={this.props.setPeopleList}
        self={this}

        inMoving={this.props.inMoving}
        setInMoving={this.props.setInMoving}


        navigation={this.props.navigation}
        route={this.props.route}


      />


    )
  }

}


function SinglePanel_({ item, setMainEnabled, setListRefEnabled, mainRef, listRef, scrollY, mainEnabled,
  //bgColor,

  // panelIndex,
  panelKey,
  getPanelIndex,
  setPanelIndex,
  panelTransY,
  allPanelArr,

  self,
  setPeopleList,

  navigation,
  route,

  inMoving,
  setInMoving,

}) {


  const avatarString = multiavatar(item.name)



  //const transY = useSharedValue(0)
  const transY = useDerivedValue(() => (withTiming(panelTransY)))


  //const [holding,setHolding] = useState(false)

  const zIndex = useSharedValue(0)

  const panelScale = useSharedValue(1)
  const elevation = useSharedValue(0)





  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  //const hilightColor = hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0])


  // const bgColor = useDerivedValue(()=>{

  //  return panelScale.value===1?"white": hilightColor


  // })
  // const bgColor = hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0])




  const panelStyle = useAnimatedStyle(() => {
    return {
      //  ...holding&&{backgroundColor:"wheat"},

      backgroundColor: bgColor,
      transform: [

        { translateY: transY.value },
        { scale: panelScale.value }
      ],

      zIndex: zIndex.value,

    }
  })


  const frameStyle = useAnimatedStyle(() => {

    let color = ""

    //  if(elevation.value!==0){color="white"}
    if (mainEnabled && elevation.value === 0) { color = "white" }

    else if (!mainEnabled && elevation.value === 0) { color = "white" }
    else if (mainEnabled && elevation.value !== 0) { color = bgColor }

    else if (!mainEnabled && elevation.value !== 0) { color = bgColor }


    return {

      width,
      height: 80,

      //backgroundColor: bgColor,

      backgroundColor: color,
      // ...holding&&{backgroundColor:"wheat"},
      //  backgroundColor: bgColor.value,
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

  const movingUpLine = 60 + 40
  const movingDownLine = height - 80



  function scrollTo(initialY, initialTranY, direction = "goUp") {

    if (enableAutoMoving.value) {
      listRef.current.scrollTo({ x: 0, y: direction === "goUp" ? (scrollY.value - 5) : (scrollY.value + 5), animated: false })
      transY.value = initialTranY + (scrollY.value - initialY)

      setTimeout(() => {
        scrollTo(initialY, initialTranY, direction)
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

    allPanelArr.current = moveArr(allPanelArr.current, from, to)
    const newList = []
    allPanelArr.current.forEach((panel, index) => {

      newList.push({ name: panel.name, description: panel.description, key: Math.random() })

    })
    allPanelArr.current = []

    setTimeout(() => {
      setMainEnabled(true)
      setInMoving(false)
      setPeopleList(newList)

    }, 200);




  }





  const enableAutoMoving = useSharedValue(false)

  //const enabled = useSharedValue(false)

  let timeout = ""


  const gestureHandler = useAnimatedGestureHandler({

    onStart: (event, obj) => {

      obj.offsetY = transY.value
      obj.preAbsY = event.absoluteY

      timeout && clearTimeout(timeout)
      //   if (enabled.value) {
      runOnJS(settingMovePermission)()
      //   }
    },
    onActive: (event, obj) => {
      timeout && clearTimeout(timeout)
      if (panelScale.value !== 0.8) return
      zIndex.value = 10


      //show(obj.offsetY)
      //show(event.translationY)

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
      zIndex.value = 0
      enableAutoMoving.value = false
      if (panelScale.value !== 0.8) return

      const v = Math.round(transY.value / 80) * 80

      transY.value = withTiming(v)
      panelScale.value = withTiming(1)
      elevation.value = withTiming(0)



      runOnJS(reSortList)()


      obj.preAbsY = event.absoluteY
    },
    onFail: (event, obj) => {
      if (panelScale.value !== 0.8) return
    },
    onCancel: (event, obj) => {
      if (panelScale.value !== 0.8) return
    },
    onFinish: (event, obj) => {
      if (panelScale.value !== 0.8) return




    }

  })




  return (


    <PanGestureHandler

      maxPointers={1}
      onGestureEvent={gestureHandler}
      shouldCancelWhenOutside={false}

      enabled={(inMoving === false || inMoving === panelKey)}

      simultaneousHandlers={[mainRef, listRef]}




    >
      <View style={[panelStyle]} >
        <TouchableOpacity    // style={{backgroundColor:"yellow"}}
          // style={{ backgroundColor: "white" }}
          //   ...holding&&{backgroundColor:"wheat"},


          activeOpacity={0.5}



          onPress={function () {

            navigation.navigate('Chat', { item: self.props.item })
          }}

          onLongPress={function () {


            setMainEnabled(false)

            setInMoving(panelKey)


            timeout = setTimeout(() => {
              setMainEnabled(true)
              setInMoving(false)
              panelScale.value = withTiming(1)
              elevation.value = withTiming(0)
            }, 5000);

            panelScale.value = withTiming(0.8)
            elevation.value = withTiming(10)


          }}


        >

          <View style={[frameStyle, { borderBottomWidth: 1, borderBottomColor: "#DDD" }]}  >


            <SharedElement id={item.name}  >
              <SvgUri style={{ margin: 10 }} width={60} height={60} svgXmlData={multiavatar(item.name)} />

              {/* <Image
                source={{ uri: "https://picsum.photos/200/300" }}
                style={{ width: 60, height: 60, resizeMode: "contain", }}

              /> */}

            </SharedElement>


            <Text style={{ fontSize: 20 }}>{item.name}</Text>


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
