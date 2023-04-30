import React, { useState, useEffect, useContext, useRef } from "react";
import { View, SafeAreaView, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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

  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={{flex: 1}}>
          <ScrollView
            style={[styles.scroll, {flexGrow: 1}]}
            ref={scrollViewRef}
            onContentSizeChange={scrollToBottom}
            showsVerticalScrollIndicator={false}
          >
            <MessageView messages={messages} />
          </ScrollView>
        </View>
        <View>
          <ClearPendingMatch pendingMatch={pendingMatch} />
          <TextField pendingMatch={pendingMatch} />
        </View>
      </KeyboardAvoidingView>
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
      <Pressable style={styles.foundFriendButton} onPress={_handleClearPendingMatch}>
        <Text style={styles.foundFriendText}>Found your friend?</Text>
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
    <View style={styles.messageSendBox}>
      <TextInput
        onChangeText={onChangeText}
        value={text}
        placeholder="Enter your message."
        keyboardType="default"
        style={styles.textInput}
      />
      <Pressable onPress={_handleMessageSend} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
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
          return <MessageBubble containerStyle={styles.senderBubble} textStyle={styles.senderText} key={i} message={message} />;
        return <MessageBubble containerStyle={styles.receiverBubble} textStyle={styles.receiverText} key={i} message={message} />;
      })}
    </View>
  );
};

const MessageBubble = ({ containerStyle, textStyle, message }: { containerStyle: object, textStyle: object, message: Message }) => {
  return (
    <View style={[styles.messageContainer, containerStyle]}>
      <Text style={[styles.messageText, textStyle]}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 8,
  },
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
  messageSendBox: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#0A84FF',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  foundFriendButton: {
    height: 35,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foundFriendText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MatchView;
