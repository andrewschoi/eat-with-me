import React, {useState, useEffect, useContext} from "react";
import MessageView from "./components/messageView";
import TextController from "./components/textController";
import {SafeAreaView} from 'react-native';
import {Message} from "../../firebase/types"
import userContext from "../../contexts/userContext";
import * as BE from "../../firebase/common"


const Messaging = () => {
  const [messages, setMessages] = useState<Message[]>()
  const [receiver, setReceiver] = useState<string>("")
  const UserContext = useContext(userContext)
  const handleListenerChange = (messages: Message[]) => {
    setMessages(() => messages)
  }
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (UserContext?.user?.name) {
        const msg = await BE.getMessages(UserContext.user.name, receiver)
        setMessages(msg)
      }
    }
      
    const unsubscribe = UserContext?.user?.name ? BE.messageListener(UserContext.user.name, receiver, handleListenerChange) : () => {return}
    fetchMessages()
    return () => unsubscribe()
  }, [])

  return <SafeAreaView>
    {MessageView(messages)}
    <TextController receiver={receiver}/>
  </SafeAreaView>
}

export default Messaging