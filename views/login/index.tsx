import React, { useContext, useState } from "react";
import userContext from "../../contexts/userContext";
import { TextInput, SafeAreaView, View, Pressable, Text, StyleSheet } from "react-native";
import * as BE from "../../firebase/common";

const Login = () => {
  const UserContext = useContext(userContext);
  const [username, setUsername] = useState<string>("");

  const handleLogin = async () => {
    const user = await BE.getUser(username);
    if (user === null) {
      console.log("no user with that username exist");
      return;
    }
    UserContext?.setUser(user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        EatWithMe
      </Text>
      <View style={styles.login}>
        <TextInput
          style={styles.textInput}
          onChangeText={setUsername}
          value={username}
          placeholder="Enter your username."
          keyboardType="default"
        />

        <Pressable onPress={handleLogin} style={styles.buttonContainer}>
          <Text style={styles.button}>Sign In</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    color: 'white',
    backgroundColor: 'black',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  textInput: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 40,
  },
  login: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: '100%',
  },
});

export default Login;
