import React from "react";
import { View, Button, Text } from "react-native";
import { EatRequest } from "../../../firebase/types";
import { StackScreenProps } from "@react-navigation/stack";

type RequestDetailProps = StackScreenProps<any> & {
  request: EatRequest | null;
};

const RequestDetail = ({ request, navigation }: RequestDetailProps) => {
  const handleNavigateToRequests = () => {
    navigation.navigate("Requests");
  };
  return (
    <View>
      <Text>{request?.location}</Text>
    </View>
  );
};

export default RequestDetail;
