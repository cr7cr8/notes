import React, { useState } from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets, HeaderTitle } from '@react-navigation/stack';


import { StyleSheet, Button, } from 'react-native';

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

} from 'react-native-reanimated';
//import Svg, { Circle, Rect, SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
const { View, Text, Image, ScrollView } = ReAnimated

import multiavatar from '@multiavatar/multiavatar';

//const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
import base64 from 'react-native-base64';
export function HomeScreen({ navigation, route }) {

  const sv = useSharedValue(0)

  // const backgroundColorInterpolation = interpolateColors(sv.value, {
  // 	inputRange:[0,15],
  // 	outputColorRange:["tomato","teal"]
  // })

  // console.log(multiavatar("aaa"))

  const style = useAnimatedStyle(() => {
    return {
      //  backgroundColor: backgroundColorInterpolation,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: backgroundColorInterpolation,
      //  width:withTiming(sharedValue.value)
    }
  })
 // console.log(base64.encode(multiavatar("personName")))

console.log("xxx")

  const src_ = "data:image/svg+xml;base64," + base64.encode(multiavatar("personName"))
  const base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';

  return (
    <View style={style}>
      <Text>Home Screen</Text>

      {/* <Image
        source={{ uri: Base64.btoa(multiavatar("aaa")) }}
        //source={{ uri: multiavatar("aaa") }}
        style={{
          resizeMode: "cover", width: 100, height: 100, //borderRadius: 40,
        }} /> */}

      {/* <Text>{Base64.btoa(multiavatar("aaa"))}</Text> */}
      {/* <Svg height="50%" width="50%" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg> */}

      <SvgUri
        width={100}
        height={100}
      //     source={{uri:multiavatar("personName")}}
        svgXmlData={multiavatar("perdsonName")}
      //  source={require('./aaa.svg')}
      //data:image/jpeg;base64 ${Base64.btoa(multiavatar("aaa"))}
      // source={{uri: `data:image/svg+xml;base64 PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS40OSwwLDAsMSwwLTE2My4zNFoiIHN0eWxlPSJmaWxsOiNCNDAwQzI7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1YTYzLjc1IDYzLjc1IDAgMCAwLTEwLjUgMTI2LjYzdjE0LjA5YTExNS41IDExNS41IDAgMCAwLTUzLjcyOSAxOS4wMjcgMTE1LjUgMTE1LjUgMCAwIDAgMTI4LjQ2IDAgMTE1LjUgMTE1LjUgMCAwIDAtNTMuNzI5LTE5LjAyOXYtMTQuMDg0YTYzLjc1IDYzLjc1IDAgMCAwIDUzLjI1LTYyLjg4MSA2My43NSA2My43NSAwIDAgMC02My42NS02My43NSA2My43NSA2My43NSAwIDAgMC0wLjA5OTYxIDB6IiBzdHlsZT0iZmlsbDojZjdjMWE2OyIvPjxwYXRoIGQ9Im04OC4xOCAxOTQuMTFjLTQuMjA3OSAxLjAyMS04LjM1NDUgMi4yNzkyLTEyLjQyIDMuNzY5NXYyNi4wNzJhMTE1LjUgMTE1LjUgMCAwIDAgNzkuNDggMHYtMjYuMDcyYy00LjA4NTgtMS40OTA0LTguMjUyOS0yLjc0ODYtMTIuNDgtMy43Njk1djguNzA1MWMwIDkuMzg4OC03LjYxMTIgMTctMTcgMTdoLTIwLjU4Yy05LjM4ODggMC0xNy03LjYxMTItMTctMTd2LTguNzA1MXoiIHN0eWxlPSJmaWxsOiM0OTFmNDk7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1Yy0zOC43MDIgNS4zMTAxLTU0LjIxNSAxOC4wMzgtNTkuODYzIDM1LjEwMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0xMTUuNSA1MS43NWMtNy44MzkzIDMuNjMzNy01LjU5NzQgMTYuNTgzLTE0LjM0MSAyMy40NTIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTExLjM1IDQ4LjYxNGMtMjIuNjM0LTYuOTE4MS00Mi40NTctMy4xOTg4LTU1LjczMyAyLjUxMDUiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTE1LjQ3IDU0LjAwOGMwLjE5NjUtNi43Nzc0LTAuMTQzNi0yNi4zMDkgMC4wNS0zOC4xODQiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtNjguODc0IDI4LjE3N2MzNC4xMTUtMy4zODIgNDEuOTg3IDEzLjMyMSA0NS4xNyAxOS42MDIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTE2LjQ5IDQ4LjY5YzIuODg3Ni02LjMwMTkgMTAuMzU4LTIxLjUxOCA0My40NjktMjIuMzI2IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiMzMjM5M2Y7Ii8+PHBhdGggZD0ibTExNi45MiA1MS43NjZjMS41MDk0IDYuMzk5MSAzLjQ5ODggMTUuNTk1IDEwLjA4OCAyMy4wNTgiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTEzLjgxIDUxLjUzMmMyMi4wMy03Ljg2NzQgNDYuNzA5LTcuMzYxNCA1OS40NDQtMi4wNDY1IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiMzMjM5M2Y7Ii8+PHBhdGggZD0ibTExNC41MyA1Mi4yNzhjMzYuMjI2IDQuODU4MyA1Mi40MTQgMTcuMDkyIDU5LjM3MyAzMy4zNDciIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtNTUuNjM3IDg2Ljg1MWMtNC4xMjEzIDEyLjQ1Mi0yLjk4NzcgMjcuMjEzLTEuNzc3IDQzLjA4NCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im01NS42MTQgNTEuMTI0Yy0xMy40MjIgNS41MDE5LTIxLjkwOCAxNi40MDktMjQuNzEyIDI4Ljc3NC0xLjgzMjIgOC40NjMyLTEuOTgwOSAxOC4xNTYtMS42MDk2IDI4LjQ4NiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0xNzMuMjYgNDkuNDg2YzI0LjkxNyAxMC4zOTkgMjYuNzA3IDM2LjUzNyAyNy4yMDkgNTkuNjIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTczLjkgODUuNjI1YzUuNDA0MiAxMi42MjUgNS4yNDEzIDI3LjY3NSA0LjU3NDUgNDMuNTgiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtNTMuODYgMTI5LjkzYzEuMjkzIDE2Ljk1MSAyLjY3MzggMzUuMTY5LTIuMTY2NCA1My4xOTMiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMjkuMjkyIDEwOC4zOGMwLjYxNzMgMTcuMTc3IDIuNjcyMiAzNi4xMTkgMC44MTU4IDU0LjEwOCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0yMDAuNDcgMTA5LjExYzAuMzU4NiAxOC41MjktMS4yNzUxIDM2Ljk0IDEuOTIzMSA0OC45ODUiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTc4LjQ4IDEyOS4yYy0wLjcyNzkgMTcuMzYyLTIuMDU2MyAzNS43NDMgMi42MDExIDUzLjA5OSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0xMzEuNjQgMTE0LjA5IDcuNTgwMS03LjU4MDEgNy41ODAxIDcuNTgwMW0tNjIuNiAwIDcuNTgwMS03LjU4MDEgNy41Nzk5IDcuNTgwMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjYuNDk5OHB4O3N0cm9rZTojMDAwOyIvPjxwYXRoIGQ9Im05Ny4wNiAxNDQuNTlhMjAuMTUgMjAuMTUgMCAwIDAgMzYuODggNC41M3oiIHN0eWxlPSJmaWxsOiNmZmY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoyLjk5OTlweDtzdHJva2U6IzAwMDsiLz48L3N2Zz4=`}}
      // uri={"https://api.multiavatar.com/Starcraeesher.svg"}
      // source={ `data:image/jpeg;base64 ${Base64.btoa(multiavatar("aaa"))}`}

      />
      <Image
        //       source={{uri: `data:image/svg+xml;base64 PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS40OSwwLDAsMSwwLTE2My4zNFoiIHN0eWxlPSJmaWxsOiNCNDAwQzI7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1YTYzLjc1IDYzLjc1IDAgMCAwLTEwLjUgMTI2LjYzdjE0LjA5YTExNS41IDExNS41IDAgMCAwLTUzLjcyOSAxOS4wMjcgMTE1LjUgMTE1LjUgMCAwIDAgMTI4LjQ2IDAgMTE1LjUgMTE1LjUgMCAwIDAtNTMuNzI5LTE5LjAyOXYtMTQuMDg0YTYzLjc1IDYzLjc1IDAgMCAwIDUzLjI1LTYyLjg4MSA2My43NSA2My43NSAwIDAgMC02My42NS02My43NSA2My43NSA2My43NSAwIDAgMC0wLjA5OTYxIDB6IiBzdHlsZT0iZmlsbDojZjdjMWE2OyIvPjxwYXRoIGQ9Im04OC4xOCAxOTQuMTFjLTQuMjA3OSAxLjAyMS04LjM1NDUgMi4yNzkyLTEyLjQyIDMuNzY5NXYyNi4wNzJhMTE1LjUgMTE1LjUgMCAwIDAgNzkuNDggMHYtMjYuMDcyYy00LjA4NTgtMS40OTA0LTguMjUyOS0yLjc0ODYtMTIuNDgtMy43Njk1djguNzA1MWMwIDkuMzg4OC03LjYxMTIgMTctMTcgMTdoLTIwLjU4Yy05LjM4ODggMC0xNy03LjYxMTItMTctMTd2LTguNzA1MXoiIHN0eWxlPSJmaWxsOiM0OTFmNDk7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1Yy0zOC43MDIgNS4zMTAxLTU0LjIxNSAxOC4wMzgtNTkuODYzIDM1LjEwMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0xMTUuNSA1MS43NWMtNy44MzkzIDMuNjMzNy01LjU5NzQgMTYuNTgzLTE0LjM0MSAyMy40NTIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTExLjM1IDQ4LjYxNGMtMjIuNjM0LTYuOTE4MS00Mi40NTctMy4xOTg4LTU1LjczMyAyLjUxMDUiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTE1LjQ3IDU0LjAwOGMwLjE5NjUtNi43Nzc0LTAuMTQzNi0yNi4zMDkgMC4wNS0zOC4xODQiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtNjguODc0IDI4LjE3N2MzNC4xMTUtMy4zODIgNDEuOTg3IDEzLjMyMSA0NS4xNyAxOS42MDIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTE2LjQ5IDQ4LjY5YzIuODg3Ni02LjMwMTkgMTAuMzU4LTIxLjUxOCA0My40NjktMjIuMzI2IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiMzMjM5M2Y7Ii8+PHBhdGggZD0ibTExNi45MiA1MS43NjZjMS41MDk0IDYuMzk5MSAzLjQ5ODggMTUuNTk1IDEwLjA4OCAyMy4wNTgiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTEzLjgxIDUxLjUzMmMyMi4wMy03Ljg2NzQgNDYuNzA5LTcuMzYxNCA1OS40NDQtMi4wNDY1IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiMzMjM5M2Y7Ii8+PHBhdGggZD0ibTExNC41MyA1Mi4yNzhjMzYuMjI2IDQuODU4MyA1Mi40MTQgMTcuMDkyIDU5LjM3MyAzMy4zNDciIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtNTUuNjM3IDg2Ljg1MWMtNC4xMjEzIDEyLjQ1Mi0yLjk4NzcgMjcuMjEzLTEuNzc3IDQzLjA4NCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im01NS42MTQgNTEuMTI0Yy0xMy40MjIgNS41MDE5LTIxLjkwOCAxNi40MDktMjQuNzEyIDI4Ljc3NC0xLjgzMjIgOC40NjMyLTEuOTgwOSAxOC4xNTYtMS42MDk2IDI4LjQ4NiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0xNzMuMjYgNDkuNDg2YzI0LjkxNyAxMC4zOTkgMjYuNzA3IDM2LjUzNyAyNy4yMDkgNTkuNjIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTczLjkgODUuNjI1YzUuNDA0MiAxMi42MjUgNS4yNDEzIDI3LjY3NSA0LjU3NDUgNDMuNTgiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtNTMuODYgMTI5LjkzYzEuMjkzIDE2Ljk1MSAyLjY3MzggMzUuMTY5LTIuMTY2NCA1My4xOTMiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMjkuMjkyIDEwOC4zOGMwLjYxNzMgMTcuMTc3IDIuNjcyMiAzNi4xMTkgMC44MTU4IDU0LjEwOCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0yMDAuNDcgMTA5LjExYzAuMzU4NiAxOC41MjktMS4yNzUxIDM2Ljk0IDEuOTIzMSA0OC45ODUiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6IzMyMzkzZjsiLz48cGF0aCBkPSJtMTc4LjQ4IDEyOS4yYy0wLjcyNzkgMTcuMzYyLTIuMDU2MyAzNS43NDMgMi42MDExIDUzLjA5OSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojMzIzOTNmOyIvPjxwYXRoIGQ9Im0xMzEuNjQgMTE0LjA5IDcuNTgwMS03LjU4MDEgNy41ODAxIDcuNTgwMW0tNjIuNiAwIDcuNTgwMS03LjU4MDEgNy41Nzk5IDcuNTgwMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjYuNDk5OHB4O3N0cm9rZTojMDAwOyIvPjxwYXRoIGQ9Im05Ny4wNiAxNDQuNTlhMjAuMTUgMjAuMTUgMCAwIDAgMzYuODggNC41M3oiIHN0eWxlPSJmaWxsOiNmZmY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoyLjk5OTlweDtzdHJva2U6IzAwMDsiLz48L3N2Zz4=`}}

        source={{ uri: base64Icon }}
        //source={{ uri: "https://picsum.photos/200/300" }}
        //source={{ uri: multiavatar("aaa") }}
        style={{
          resizeMode: "cover", width: 100, height: 100, //borderRadius: 40,
        }} />
      <Button title="tdtt" />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Detail')}
      />
    </View>
  );
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