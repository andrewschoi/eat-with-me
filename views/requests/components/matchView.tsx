import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
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
      <ScrollView>
      <MessageView messages={messages} />
      <ClearPendingMatch pendingMatch={pendingMatch} />
      <TextField pendingMatch={pendingMatch} />
      </ScrollView>
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
          return <MessageBubble style={[styles.senderBubble, styles.messageText, styles.senderText]} key={i} message={message} />;
        return <MessageBubble style={[styles.receiverBubble, styles.messageText, styles.receiverText]} key={i} message={message} />;
      })}
    </View>
  );
};

const MessageBubble = ({ style, message }: { style: object, message: Message }) => {
  return (
    <View style={styles.messageContainer}>
      <Text style={style}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 8,
  },
  senderBubble: {
    backgroundColor: "#0A84FF",
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopRightRadius: 0,
    maxWidth: "70%",
  },
  receiverBubble: {
    backgroundColor: "#E1E1E1",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    maxWidth: "70%",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  senderText: {
    color: "white",
  },
  receiverText: {
    color: "black",
  },
});

export default MatchView;
