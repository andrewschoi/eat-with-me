import React from "react";
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
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

  const handleAccept = () => {
    console.log("Request accepted");
  }

  return (
    <View style = {styles.container}>
      <Pressable onPress={handleNavigateToDetail}>
        <View style = {styles.textContainer}>
          <Text style={styles.text}>{request.requester}</Text>
          <Text style={styles.secondaryText}>{request.location} {request.timestamp}</Text>
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
    flexDirection: 'row',
    padding: 20,
    height: 100,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'black',
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Open Sans',
  },
  secondaryText: {
    fontSize: 15,
    color: 'gray'
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  acceptButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginLeft: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
  },
  });

export default RequestRow;
