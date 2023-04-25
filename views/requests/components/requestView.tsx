import React from "react";
import { View, ScrollView, Button, Text, Pressable, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
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
    <View style={styles.container}>
      <ScrollView>
        {openRequests.map((req: any) => (
          <RequestRow
            key={req.requester}
            request={req}
            navigation={navigation}
          />
        ))}
      </ScrollView>

      <View style={styles.addButton}>
        <AntDesign onPress={handleNavigateToForm} name="pluscircle" size={32} color="#007AFF" />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "white",
    padding: 10,
    width: 55,
    overflow: "hidden",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 10,
  }
});

export default RequestView;
