import React from "react";
import { View, Text, Pressable } from "react-native";
import { EatRequest } from "../../../firebase/types";
import { StackNavigationProp } from "@react-navigation/stack";

type RequestRowProps = {
  request: EatRequest;
  navigation: StackNavigationProp<any>;
};

const RequestRow = ({ request, navigation }: RequestRowProps) => {
  const handleNavigateToDetail = () => {
    navigation.navigate("Detail", { request: request });
  };

  return (
    <View>
      <Pressable onPress={handleNavigateToDetail}>
        <Text>Learn more about this request</Text>
      </Pressable>
    </View>
  );
};

export default RequestRow;
