import React, {useState, useContext} from "react"
import {TextInput, View} from 'react-native';
import * as BE from "../../../firebase/common"
import userContext from "../../../contexts/userContext";

export default function TextController({receiver} : {receiver: string}) {
  const [text, onChangeText] = useState<string>("")
  const UserContext = useContext(userContext)
  const handleMessageSend = () => {
    if (UserContext?.user?.name)
      BE.addMessage(UserContext.user.name, receiver,text)
  }
  return <View><TextInput onChangeText={onChangeText}
        value={text}
        placeholder="Enter your message."
        keyboardType="default"/></View>
}