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

  const [flatListEnabled, setFlatListEnabled] = useState(true)

  const simultaneousHandlers = useRef()

  useEffect(function () {


    //console.log(simultaneousHandlers.current)
  })



  return (

    <ScrollView
      //contentOffset={{x:100,y:0}}
      decelerationRate={"fast"}
      snapToInterval={width}
      horizontal={true}
      ref={simultaneousHandlers}
    >

      <ScrollView style={{ width, backgroundColor: "pink" }}>
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
      </ScrollView>


      <ScrollView style={{ width, backgroundColor: "skyblue" }}>
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
        <SinglePanel setFlatListEnabled={setFlatListEnabled} simultaneousHandlers={simultaneousHandlers} />
      </ScrollView>

    </ScrollView>


  )


  // return (

  //   <FlatList



  //     snapToInterval={360}
  //     data={[{ key: "home" }, { key: "message" }, { key: "profile" }]}
  //     keyExtractor={function (item) { return item.key }}
  //     horizontal={true}
  //     // scrollEnabled={flatListEnabled}
  //     scrollEnabled={true}
  //     ref={simultaneousHandlers}
  //     renderItem={function ({ item, index }) {

  //       return (

  //         <ScrollView
  //           style={{ width, backgroundColor: "skyblue" }}
  //           contentContainerStyle={{

  //             backgroundColor: "wheat",
  //             //overflow:"visible"
  //             minHeight: 500,
  //           }}
  //           onLayout={(event) => {
  //             //console.log(event.nativeEvent.layout)
  //           }}
  //         >

  //           {item.key === "home" && <SinglePanel setFlatListEnabled={setFlatListEnabled} flatListRef={simultaneousHandlers} />}
  //           {item.key === "home" && <SinglePanel setFlatListEnabled={setFlatListEnabled} flatListRef={simultaneousHandlers} />}
  //           {item.key === "home" && <SinglePanel setFlatListEnabled={setFlatListEnabled} flatListRef={simultaneousHandlers} />}
  //           {item.key === "home" && <SinglePanel setFlatListEnabled={setFlatListEnabled} flatListRef={simultaneousHandlers} />}

  //           {item.key === "message" && <SinglePanel setFlatListEnabled={setFlatListEnabled} flatListRef={simultaneousHandlers} />}
  //           {item.key === "message" && <SinglePanel setFlatListEnabled={setFlatListEnabled} flatListRef={simultaneousHandlers} />}

  //         </ScrollView>





  //       )
  //     }

  //     }
  //   />


  // )





  return (
    <ScrollView style={style}
      contentContainerStyle={{
        //flex: 1,


        backgroundColor: "wheat",
        //overflow:"visible"
        minHeight: 500,
      }}
      onLayout={(event) => {
        //console.log(event.nativeEvent.layout)
      }}
    >




      <SinglePanel />

      <SinglePanel />





      {/* <Text>Home Screen</Text>

      <Button title="tdtgfdft" />
      <Button title="Go to Details" onPress={() => navigation.navigate('Detail')} /> */}
    </ScrollView>
  );
}


class SinglePanel extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {

    return (

      <SinglePanel_ setFlatListEnabled={this.props.setFlatListEnabled} simultaneousHandlers={this.props.simultaneousHandlers} />


    )
  }

}


function SinglePanel_({ setFlatListEnabled, simultaneousHandlers }) {

  const list = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President'
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman'
    },
    //  ... // more items
  ]




  const preTransY = useSharedValue(0)
  const transY = useSharedValue(0)
  const zIndex = useSharedValue(0)
  const panelScale = useSharedValue(1)


  const dragButtonScale = useSharedValue(0)

  const rotateZ = useDerivedValue(() => {
    return withTiming(dragButtonScale.value === 0 ? 0 : 180, {
      duration: 2000,
      //   easing: Easing.linear,
    });
  });


  const [dragEnabled, setDragEnabled] = useState(false)

  const showEvent = (event) => { console.log(event) }



  const panelStyle = useAnimatedStyle(() => {

    //    const rotateDeg = interpolate(dragButtonScale.value, [0, 1], [0, 360], { extrapolateRight: Extrapolate.CLAMP })

    return {

      //  height: 60,
      transform: [

        { translateY: transY.value },

        //  { scale: withTiming(panelScale.value, 200) },
        // { rotateY: rotateZ.value + "deg" }
        // { rotateY: withTiming(interpolate(dragButtonScale.value, [0, 1], [0, 360], { extrapolateRight: Extrapolate.CLAMP })) },

      ],

      backgroundColor: "#pink",
      shadowColor: '#ff0000',
      zIndex: zIndex.value,



    }
  })

  const dragButtonStyle = useAnimatedStyle(() => {

    return {

      // transform: [{ scale: withTiming(dragButtonScale.value, 200) },]

    }
  })





  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, obj) => {

      //   runOnJS(showEvent)(event)
    },
    onActive: (event, obj) => {
      transY.value = preTransY.value + event.translationY;
      zIndex.value = 10


    },
    onEnd: (event, obj) => {
      preTransY.value = preTransY.value + event.translationY;

      zIndex.value = 0
      //   dragButtonScale.value = 0
      //   panelScale.value = 1
      runOnJS(setDragEnabled)(false)
      runOnJS(setFlatListEnabled)(true)
    }


  })


  const panRef = useRef()



  return (
    <PanGestureHandler
      ref={panRef}
      maxPointers={1}
      onGestureEvent={gestureHandler}
      //enabled={dragEnabled}
      enabled={true}
      simultaneousHandlers={simultaneousHandlers}
    >

      <View style={[panelStyle]} >

        <ListItem
          bottomDivider={true}
          containerStyle={[{ elevation: 3, padding: 10, },]}
          //    onPressOut={function(){ dragButtonScale.value = 0;  panelScale.value =1;   setDragEnabled(false)}}
          onLongPress={function () { dragButtonScale.value = 1; panelScale.value = 0.8; setFlatListEnabled(false); setDragEnabled(true) }}

          onFocus={function () { dragButtonScale.value = 1; panelScale.value = 0.8; setFlatListEnabled(false); setDragEnabled(true) }}


        >
          <SvgUri width={60} height={60} svgXmlData={multiavatar(Math.random())} />
          <ListItem.Content >
            <ListItem.Title>{list[0].name}</ListItem.Title>
            <ListItem.Subtitle>{list[0].subtitle}</ListItem.Subtitle>
          </ListItem.Content>

          <View style={[dragButtonStyle]}>
            <Icon
              containerStyle={{ width: 60, height: 60, display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding: 0 }}
              size={60}
              name='drag'
              type='material-community'
              color='gray'
              raised={false}

            />
          </View>

        </ListItem>
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