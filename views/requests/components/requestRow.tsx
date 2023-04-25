import React, { useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { EatRequest } from "../../../firebase/types";
import userContext from "../../../contexts/userContext";
import { StackNavigationProp } from "@react-navigation/stack";
import * as BE from "../../../firebase/common";

type RequestRowProps = {
  request: EatRequest;
  navigation: StackNavigationProp<any>;
};

const RequestRow = ({ request, navigation }: RequestRowProps) => {
  const UserContext = useContext(userContext);

  const handleNavigateToDetail = () => {
    navigation.navigate("Detail", { request: request });
  };

  const handleAccept = async () => {
    if (UserContext?.user === null || UserContext?.user.name === undefined) {
      console.log("user is null, cannot accept request");
      return;
    }

    if (!BE.canAcceptRequest(UserContext.user.name, request)) {
      console.log(
        `${UserContext.user.name} cannot accept ${UserContext.user.name} own request`
      );
      return;
    }

    const user1 = UserContext?.user.name;
    const user2 = request.requester;
    const location = request.location;
    const pendingMatch = BE.createPendingMatch(user1, user2, location);
    const success = await BE.addPendingMatch(user1, user2, location);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleNavigateToDetail}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{request.requester}</Text>
          <Text style={styles.secondaryText}>
            {request.location} {request.timestamp}
          </Text>
        </View>
      </Pressable>
      <TouchableOpacity onPress={handleAccept} style={styles.acceptButton}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
    height: 150,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  secondaryText: {
    fontSize: 15,
    color: "gray",
  },
  acceptButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 60,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RequestRow;
