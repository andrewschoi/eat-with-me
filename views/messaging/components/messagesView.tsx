import React from "react";
import { View } from "react-native";
import { Message } from "../../../firebase/types";
import MessageBubble from "./messageBubble";
import { StackScreenProps } from "@react-navigation/stack";

type MessageViewProps = StackScreenProps<any> & {
  messages: Message[];
};

const MessageView = ({ navigation, messages }: MessageViewProps) => {
  return (
    <View>
      {messages ? messages.map((msg) => <MessageBubble message={msg} />) : null}
    </View>
  );
};

export default MessageView;
