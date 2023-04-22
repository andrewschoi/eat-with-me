import React from "react";
import { View, ScrollView, Button, Text } from "react-native";
import RequestRow from "./requestRow";
import { StackScreenProps } from "@react-navigation/stack";
import { EatRequest } from "../../../firebase/types";

type RequestViewProps = StackScreenProps<any> & {
  openRequests: EatRequest[];
};

const RequestView = ({ navigation, openRequests }: RequestViewProps) => {
  const handleNavigateToForm = () => {
    navigation.navigate("Form");
  };
  return (
    <View>
      <ScrollView>
        {openRequests.map((req: any) => (
          <RequestRow
            key={req.requester}
            request={req}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RequestView;
