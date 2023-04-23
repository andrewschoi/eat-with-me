import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { PendingMatch } from "../../../firebase/types";

type MatchViewProps = StackScreenProps<any>;

const MatchView = ({ route }: MatchViewProps) => {
  const pendingMatch: PendingMatch = route.params?.pendingMatch;
  return (
    <View>
      <Text>{pendingMatch.people[0]}</Text>
      <Text>{pendingMatch.people[1]}</Text>
      <Text>{pendingMatch.location}</Text>
      <Text>{pendingMatch.timestamp}</Text>
    </View>
  );
};

export default MatchView;
