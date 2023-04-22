import React from "react"
import {Text, View} from 'react-native';
import * as BE from "../../../firebase/common"
import {Message} from "../../../firebase/types"
import MessageBubble from "./messageBubble"

export default function MessageView(messages : Message[] | undefined) {
  return <View>{messages ? messages.map(msg => <MessageBubble message={msg}/>) : null}</View>
}