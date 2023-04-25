import React from "react";
import { View, Button, Text } from "react-native";
import { EatRequest } from "../../../firebase/types";
import { StackScreenProps } from "@react-navigation/stack";

type RequestDetailProps = StackScreenProps<any>;

const RequestDetail = ({ route, navigation }: RequestDetailProps) => {
  const handleNavigateToRequests = () => {
    navigation.navigate("Requests");
  };
  const request: EatRequest = route.params?.request;
  return (
    <View>
      <Text>{request?.location}</Text>
    </View>
  );
};

export default RequestDetail;
