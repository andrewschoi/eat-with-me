import React, {useState} from "react"
import {TextInput, View} from 'react-native';
import {Message} from "../../../firebase/types"

export default function TextController() {
  const [text, onChangeText] = useState<string>("")
  return <View><TextInput onChangeText={onChangeText}
        value={text}
        placeholder="Enter your message."
        keyboardType="default"/></View>
}