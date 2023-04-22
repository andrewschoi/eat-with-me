import React from "react";
import { View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

type ConversationViewProps = StackScreenProps<any> & {
  receivers: string[];
};

const ConversationView = ({ receivers, navigation }: ConversationViewProps) => {
  return <View></View>;
};

export default ConversationView;
