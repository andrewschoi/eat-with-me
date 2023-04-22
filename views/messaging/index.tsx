import React, { useState, useEffect, useContext } from "react";
import userContext from "../../contexts/userContext";
import { createStackNavigator } from "@react-navigation/stack";
import ConversationView from "./components/conversationsView";
import MessagesView from "./components/messagesView";
import * as BE from "../../firebase/common";

const Stack = createStackNavigator();

const Messaging = () => {
  const [receivers, setReceivers] = useState<string[]>([]);
  const UserContext = useContext(userContext);

  useEffect(() => {
    const fetchReceivers = async () => {
      if (UserContext?.user) {
        const receivers = await BE.getReceivers(UserContext?.user.name);
        setReceivers(() => receivers);
      }
    };
    fetchReceivers();
  }, [UserContext?.user]);

  return (
    <Stack.Navigator initialRouteName="Conversations">
      <Stack.Screen
        name={"Conversations"}
        children={(props) => (
          <ConversationView receivers={receivers} {...props} />
        )}
      />
      <Stack.Screen
        name={"Messages"}
        children={(props) => <MessagesView messages={[]} {...props} />}
      />
    </Stack.Navigator>
  );
};

export default Messaging;
