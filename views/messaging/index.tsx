import React, {useState, useEffect} from "react";
import MessageView from "./components/messageView";
import TextController from "./components/textController";
import {SafeAreaView} from 'react-native';
import {Message} from "../../firebase/types"
import * as BE from "../../firebase/common"

const Messaging = (user1 : string, user2 : string) => {
  const [messages, setMessages] = useState<Message[]>()

  const handleListenerChange = (messages: Message[]) => {
    setMessages(() => messages)
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const msg = await BE.getMessages(user1, user2)
      setMessages(msg)
    }
    const unsubscribe = BE.messageListener(user1, user2, handleListenerChange)
    fetchMessages()
    return () => unsubscribe()
  }, [])

  return <SafeAreaView>
    {MessageView(messages)}
    <TextController />
  </SafeAreaView>
}

export default Messaging