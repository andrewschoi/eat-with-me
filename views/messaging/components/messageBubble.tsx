import React from "react"
import {Text, View} from 'react-native';
import {EatRequest} from "../../../firebase/types"
import * as BE from "../../../firebase/common"
import {Message} from "../../../firebase/types"

export default function MessageBubble({message} : {message: Message}) {
  return <View><Text>{message.content}</Text></View>
}