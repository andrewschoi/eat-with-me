import React, { useContext, useState } from "react";
import userContext from "../../contexts/userContext";
import { TextInput, SafeAreaView, Pressable, Text } from "react-native";
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
    <SafeAreaView>
      <TextInput
        onChangeText={setUsername}
        value={username}
        placeholder="Enter your username."
        keyboardType="default"
      />
      <Pressable onPress={handleLogin}>
        <Text>Sign In</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
