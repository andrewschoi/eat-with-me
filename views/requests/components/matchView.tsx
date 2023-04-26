import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, Text, TextInput, Pressable } from "react-native";
import { PendingMatch, Message } from "../../../firebase/types";
import userContext from "../../../contexts/userContext";
import * as BE from "../../../firebase/common";

const MatchView = () => {
  const UserContext = useContext(userContext);
  const [unsubscribe, setUnsubscribe] = useState<(() => void)[]>([]);
  const [pendingMatch, setPendingMatch] = useState<PendingMatch | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const _onMessageHandler = (messages: Message[]) => {
    const orderedMessages = BE.sortMessagesByTimestamp(messages);
    setMessages(() => orderedMessages);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (UserContext !== null && UserContext.user !== null) {
        const pendingMatch = await BE.getPendingMatch(UserContext.user.name);
        if (pendingMatch === null) return;
        setPendingMatch(pendingMatch);

        const [user1, user2] = pendingMatch.people;

        const messages = await BE.getMessages(user1, user2);
        setMessages(messages);
        const messageListener = await BE.messageListener(
          user1,
          user2,
          _onMessageHandler
        );
        setUnsubscribe((prev) => [...prev, messageListener]);
      }
    };
    fetchData();
    return () => unsubscribe.forEach((unsub) => unsub());
  }, []);

  return (
    <SafeAreaView>
      <MessageView messages={messages} />
      <ClearPendingMatch pendingMatch={pendingMatch} />
      <TextField pendingMatch={pendingMatch} />
    </SafeAreaView>
  );
};

const ClearPendingMatch = ({
  pendingMatch,
}: {
  pendingMatch: PendingMatch | null;
}) => {
  const UserContext = useContext(userContext);
  const _handleClearPendingMatch = async () => {
    if (UserContext && UserContext.user)
      BE.clearPendingMatch(UserContext.user.name, pendingMatch);
  };
  return (
    <View>
      <Pressable onPress={_handleClearPendingMatch}>
        <Text>Found your friend?</Text>
      </Pressable>
    </View>
  );
};

const TextField = ({ pendingMatch }: { pendingMatch: PendingMatch | null }) => {
  const UserContext = useContext(userContext);
  const [text, onChangeText] = useState<string>("");
  const _handleMessageSend = async () => {
    if (pendingMatch === null) {
      console.log(
        "cannot send message, as the person has already left the chat room"
      );
      return;
    }
    if (UserContext && UserContext.user) {
      const [user1, user2] = pendingMatch.people;
      const sender = UserContext.user.name;
      const success = BE.addMessage(user1, user2, text, sender);
    }
  };
  return (
    <View>
      <TextInput
        onChangeText={onChangeText}
        value={text}
        placeholder="Enter your message."
        keyboardType="default"
      />
      <Pressable onPress={_handleMessageSend}>
        <Text>Send</Text>
      </Pressable>
    </View>
  );
};

const MessageView = ({ messages }: { messages: Message[] }) => {
  const UserContext = useContext(userContext);

  const isFromSender = (message: Message) => {
    if (UserContext !== null && UserContext.user !== null)
      return UserContext.user.name === message.sender;
    return false;
  };

  return (
    <View>
      {messages.map((message, i) => {
        if (isFromSender(message))
          return <MessageBubble key={i} message={message} />;
        return <MessageBubble key={i} message={message} />;
      })}
    </View>
  );
};

const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <View>
      <Text>{message.content}</Text>
    </View>
  );
};

export default MatchView;
