import React, { useState, useRef, useEffect, useContext } from 'react';

const { compareAsc, format, formatDistanceToNow, } = require("date-fns");
const { zhCN } = require('date-fns/locale');


import {
  StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableHighlight, TouchableWithoutFeedback,
  Vibration, TextInput, Alert, Keyboard,
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

import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Badge, Switch, Input, Divider } from 'react-native-elements'
const { width, height } = Dimensions.get('screen');

import { LinearGradient } from 'expo-linear-gradient';


import url, { hexToRgbA, hexToRgbA2, hexify, moveArr, uniqByKeepFirst, ScaleView, ScaleAcitveView, deleteFolder, createFolder } from "./config";
import { SharedElement } from 'react-navigation-shared-element';
import { Context } from "./ContextProvider";
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from "react-native-status-bar-height";


import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import useKeyboardHeight from 'react-native-use-keyboard-height';



import { CommonActions } from '@react-navigation/native';








export function ProfileScreen({ navigation, route }) {

  const { token, userName, setSnackMsg, setSnackBarHeight, peopleList, setPeopleList, } = useContext(Context)


  const [isOverLay, setIsOverLay] = useState(false)

  const item = peopleList.find(people => { return people.name === route.params.item.name })

  const avatarString = multiavatar(route.params.item.name)
  const bgColor = hexify(hexToRgbA(avatarString.match(/#[a-zA-z0-9]*/)[0]))
  const bgColor2 = hexify(hexToRgbA2(avatarString.match(/#[a-zA-z0-9]*/)[0]))


  const keyboardHeight = useKeyboardHeight()



  const titleBarHeight = (getStatusBarHeight() > 24) ? 70 : 60




  const isSelf = item.name === userName


  const [description, setDescription] = useState("")
  const inputText = useRef("")

  const inputRef = useRef()


  const inputHeight = useSharedValue(0)
  const descriptionHeight = useDerivedValue(() => {

    if (inputHeight.value === 0) {
      return 200
    }
    else {
      return 60
    }

  })



  const descriptionViewStyle = useAnimatedStyle(() => {

    return {
      width,
      height: withTiming(descriptionHeight.value),
      //  backgroundColor: "brown",
      overflow: "hidden",
    }


  })


  useEffect(function () {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      descriptionHeight.value = 0
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      descriptionHeight.value = 60
    });

    return function () {
      showSubscription.remove();
      hideSubscription.remove();
    }

  }, [])


  const inputViewStyle = useAnimatedStyle(() => {

    return {
      width,
      height: withTiming(inputHeight.value),
      //    backgroundColor: "green",
      overflow: "hidden",

    }


  })


  const submitBtnViewStyle = useAnimatedStyle(() => {

    return {
      width,
      height: 54,
      transform: [{ translateY: 6 }],
      overflow: "hidden",
      //  backgroundColor: "yellow",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",

    }

  })














  const btnElevation = useSharedValue(3)
  const deleteBtnStyle = useAnimatedStyle(() => {




    return {
      elevation: withTiming(btnElevation.value),
      position: "absolute", bottom: 80, alignSelf: "center",
      width: width - 30,
      height: 50,
      backgroundColor: bgColor,
      // transform: [{ scale: withTiming(Math.abs(btnScale.value - 1)) }]

      // ...btnScale.value !== 0 && { display: "none" },
    }


  })


  const [numberOfFiles, setNumberOfFiles] = useState(0)
  const btnMessage = `Hold to delete ${numberOfFiles} messages`
  useEffect(function () {

    const name = item.name

    axios.get(`${url}/api/user/getdescription/${item.name}`, { headers: { "x-auth-token": token } }).then(response => {

      // console.log(response.data)
      setDescription(response.data)

    })


    // FileSystem.getInfoAsync(FileSystem.documentDirectory + "MessageFolder/" + name + "/")
    // .then((obj) => {
    // console.log(obj)
    // })





  }, [])






  const alertMessage = `Sure to delete ${item.name}'s messages ?`



  const [avatar, setAvatar] = useState(item.hasAvatar ? `${url}/api/image/avatar/${item.name}?${item.randomStr}` : "")


  return (

    <View style={{ backgroundColor: bgColor, width, height: height - titleBarHeight }}
      onLayout={function () {
        setImmediate(function () {
          FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "MessageFolder/" + item.name + "/")
            .then((arr) => {
              setNumberOfFiles(arr.length)
            })
        })
      }}

    >




      <View style={{
        alignItems: "center", justifyContent: "space-around", flexDirection: "row", backgroundColor: bgColor, padding: 0,

        //        backgroundColor: "pink",

        position: "relative",
        height: 120

      }}>

        {isSelf && <Button title=""

          containerStyle={{}}
          buttonStyle={{ backgroundColor: bgColor }}
          titleStyle={{ color: bgColor2 }}

          icon={{
            name: 'image-outline',
            type: 'ionicon',
            color: bgColor2,
            size: 40,
            containerStyle: {

              // width: 80, height: 80,
              justifyContent: "center",
              alignItems: "center",

            }
          }}

          onPress={function () {
            setIsOverLay(true)
            pickImage({ item, setAvatar, token, setPeopleList, setIsOverLay })


          }}



        />
        }

        <Pressable onPress={function () {



          navigation.navigate('Image', {
            item: { name: item.name, hasAvatar: item.hasAvatar },
            imagePos: 0,

            messages: [
              item.hasAvatar
                ? { image: `${url}/api/image/avatar/${item.name}?${item.randomStr}`, width: 60, height: 60, }
                : { image: "", isSvg: true }
            ],


            setMessages: "",
          })

        }}>


          {item.name !== "AllUser" && <SharedElement id={item.name} style={{ transform: [{ scale: 1 }], alignItems: "center", justifyContent: "center", }}   >
            {item.hasAvatar
              ? <Image source={{ uri: avatar || `${url}/api/image/avatar/${item.name}?${item.randomStr}` }} resizeMode="cover"
                style={{
                  position: "relative",
                  //  top: getStatusBarHeight(),
                  width: 100, height: 100, borderRadius: 1000
                }} />
              : <SvgUri style={{ position: "relative", /*top: getStatusBarHeight() */ }} width={100} height={100} svgXmlData={multiavatar(item.name)} />
            }
          </SharedElement>
          }
          {item.name === "AllUser" &&

            < Image source={{ uri: item.localImage || `${url}/api/image/avatar/${item.name}?${item.randomStr}` }} resizeMode="cover"
              style={{ width: 100, height: 100, borderRadius: 1000 }}
            />


          }

        </Pressable>


        {isSelf && <Button title=""

          //  containerStyle={{}}
          buttonStyle={{ backgroundColor: bgColor }}
          titleStyle={{ color: bgColor2 }}

          icon={{
            name: 'camera-outline',
            type: 'ionicon',
            color: bgColor2,
            size: 40,
            containerStyle: {

              // width: 80, height: 80,
              justifyContent: "center",
              alignItems: "center",

            }
          }}
          onPress={function () {
            setIsOverLay(true)
            takePhoto({ item, setAvatar, token, setPeopleList, setIsOverLay })


          }}


        />}





      </View>


      <View style={[descriptionViewStyle]}>

        <ScrollView contentContainerStyle={{
          paddingHorizontal: 8, width, flexWrap: "nowrap", //backgroundColor: bgColor,

          //     backgroundColor: "yellow"
        }}
        >
          <Text style={{ fontSize: 16, textAlign: "center" }}>{description} </Text>

        </ScrollView>


      </View>



      {isSelf && <View style={[inputViewStyle]}>
        <TextInput


          onChangeText={function (text) {

            inputText.current = text
          }}

          placeholder="Enter description here..."
          style={{

            //  backgroundColor: "skyblue", width: "100%", lineHeight: 40, fontSize: 20, textAlignVertical: 'top',

            marginVertical: 0,
            backgroundColor: "white",
            width, lineHeight: 20, fontSize: 20, textAlignVertical: 'top', paddingHorizontal: 8,
            //   transform: [{ translateY: 30 }],
            //   height: "90%",
            height: 120,

          }}


          numberOfLines={3}
          multiline={true}
          ref={inputRef}

        />



        <View style={[submitBtnViewStyle]}>

          <Button title=""
            type="clear"
            containerStyle={{ elevation: 0, }}
            //    containerStyle={{ elevation: 3, transform: [{ translateY: -10 }], }}
            //    containerStyle={{ backgroundColor: bgColor }}
            //  buttonStyle={{ backgroundColor: bgColor, }}
            //  buttonStyle={{ backgroundColor: "gold", }}

            titleStyle={{
              //  color: bgColor2,
              fontSize: 20
            }}

            icon={{
              name: 'keyboard-o',
              type: 'font-awesome',
              color: bgColor2,
              size: 40,
              containerStyle: {

                // width: 80, height: 80,
                justifyContent: "center",
                alignItems: "center",

              }

            }}

            onPress={function () {

              if (keyboardHeight === 0) {
                inputRef.current.blur()
                inputRef.current.focus()

              }
              else {
                inputRef.current.focus()
                inputRef.current.blur()
              }


            }} />



          <Button title=""
            type="clear"

            containerStyle={{ elevation: 0 }}
            //    containerStyle={{ backgroundColor: bgColor }}
            //  buttonStyle={{ backgroundColor: bgColor, }}
            buttonStyle={{ borderRadius: 1000 }}

            titleStyle={{
              //     color: bgColor2,
              borderRadius: 1000,
              fontSize: 20
            }}

            icon={{
              name: 'send',
              type: 'ionicon',
              color: bgColor2,
              size: 40,
              containerStyle: {

                // width: 80, height: 80,
                justifyContent: "center",
                alignItems: "center",

              }

            }}


            onPress={function () {
              inputRef.current.blur()


              axios.post(`${url}/api/user/updatedescription`, { description: inputText.current }, { headers: { "x-auth-token": token } }).then(response => {

                setTimeout(() => {
                  setDescription(inputText.current)
                }, 500);

                inputRef.current.blur()
                inputHeight.value = 0
                setTimeout(() => {
                  descriptionHeight.value = 200

                }, 500);


              })

            }} />





        </View>




      </View>
      }


      {isSelf && <Button title="Edit description"
        type="clear"
        titleStyle={{
          color: bgColor2,
          fontSize: 20
        }}
        icon={{
          name: 'create-outline',
          type: 'ionicon',
          size: 40,
          color: bgColor2,
        }}
        onPress={function () {




          inputHeight.value = inputHeight.value === 0 ? 180 : 0



        }}

      />

      }









      {numberOfFiles !== 0 && <View style={[deleteBtnStyle]}>
        <Button title={btnMessage}
          type="clear"

          containerStyle={{}}

          buttonStyle={{ backgroundColor: bgColor, }}
          icon={{
            name: 'trash-outline',
            type: 'ionicon',
            size: 30,
            color: bgColor2,
          }}

          titleStyle={{
            color: bgColor2,

            fontSize: 15
          }}

          onPressIn={function () {
            btnElevation.value = 0
          }}

          onPressOut={function () {
            btnElevation.value = 3
          }}



          onLongPress={function () {



            Alert.alert("Confirm", alertMessage,
              [{
                text: "Cancel",
                onPress: () => { },
                style: "cancel"
              },
              {
                text: "YES",
                onPress: async () => {

                  await deleteFolder(item.name)
                  await createFolder(item.name)
                  setSnackMsg("Deleted")
                  setSnackBarHeight(60)
                  setNumberOfFiles(0)

                  navigation.dispatch((state) => {
                    return CommonActions.reset({
                      ...state,
                      routes: state.routes.map(route => {

                        if (route.name === "Chat") {
                          return { ...route, key: "Chat-" + route.key.replace("Chat-", "").split("").reverse().join("") }
                        }
                        else if (route.name === "ChatAll") {
                          return { ...route, key: "ChatAll-" + route.key.replace("Chat-", "").split("").reverse().join("") }
                        }
                        else {
                          return route
                        }


                      }),
                      index: state.routes.length - 1,
                    });
                  });

                  //BackHandler.exitApp()
                }


              }]);
            return true
          }}

          onPress={function () {

          }}

        />
      </View>
      }


      {isSelf && <Overlay isVisible={isOverLay} fullScreen={true} overlayStyle={{ opacity: 0.5, display: "flex", justifyContent: "center", alignItems: "center" }}  >
        <LinearProgress color="primary" value={1} variant={"indeterminate"} />
        <Text>Processing...</Text>
      </Overlay>
      }

    </View>




  )


}






ProfileScreen.sharedElements = (route, otherRoute, showing) => {
  return [
    { id: route.params.item.name, animation: "move", resize: "auto", align: "left", },
  ]
};


async function pickImage({ item, setAvatar, token, setPeopleList, setIsOverLay }) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (!result.cancelled) {
    // console.log(result.uri)

    const localUri = result.uri
    let match = /\.(\w+)$/.exec(localUri.split('/').pop());
    let type = match ? `image/${match[1]}` : `image`;
    let filename = item.name


    const formData = new FormData();

    formData.append('file', { uri: result.uri, name: item.name, type });
    formData.append("obj", JSON.stringify({ ownerName: item.name }))
    formData.append("userName", item.name)

    //{ headers: { "x-auth-token": token } }

    return axios.post(`${url}/api/image//updateavatar`, formData, { headers: { 'content-type': 'multipart/form-data', "x-auth-token": token } })
      .then(response => {

        //  FileSystem.deleteAsync(localUri, { idempotent: true })

        item.hasAvatar = true


        setAvatar(localUri)


        setPeopleList(pre => {

          return pre.map(people => {
            if (people.name !== item.name) { return people }
            else {

              return { ...people, hasAvatar: true, randomStr: response.data }
            }
          })

        })


        // setPeopleList(pre => {

        //   return pre.map(people => {
        //     if (people.name !== item.name) {
        //       return people
        //     }
        //     else {
        //       return { ...people, randomStr: response.data }
        //     }
        //   })
        // })
        setIsOverLay(false)
        return response

      })

    // item.hasAvatar = true
    //setAvatar(result.uri)


  }
  else {
    setIsOverLay(false)
  }


};


async function takePhoto({ item, setAvatar, token, setPeopleList, setIsOverLay }) {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (!result.cancelled) {
    // console.log(result.uri)

    const localUri = result.uri
    let match = /\.(\w+)$/.exec(localUri.split('/').pop());
    let type = match ? `image/${match[1]}` : `image`;
    let filename = item.name


    const formData = new FormData();

    formData.append('file', { uri: result.uri, name: item.name, type });
    formData.append("obj", JSON.stringify({ ownerName: item.name }))
    formData.append("userName", item.name)

    //{ headers: { "x-auth-token": token } }

    return axios.post(`${url}/api/image//updateavatar`, formData, { headers: { 'content-type': 'multipart/form-data', "x-auth-token": token } })
      .then(response => {

        //  FileSystem.deleteAsync(localUri, { idempotent: true })

        item.hasAvatar = true


        setAvatar(localUri)


        setPeopleList(pre => {

          return pre.map(people => {
            if (people.name !== item.name) { return people }
            else {

              return { ...people, hasAvatar: true, randomStr: response.data }
            }
          })

        })



        setIsOverLay(false)
        return response

      })



  }
  else {
    setIsOverLay(false)
  }


};
