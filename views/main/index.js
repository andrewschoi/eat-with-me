import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Requests from "../requests";
import Messaging from "../messaging";
import userContext from "../../contexts/userContext";
import Login from "../login";

const Tab = createBottomTabNavigator();

export default function Main() {
  const UserContext = useContext(userContext);

  if (UserContext?.user === null) {
    return <Login />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name="Home"
          component={Requests}
          options={{
            title: "Home",
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Messaging"
          component={Messaging}
          options={{
            title: "Messaging",
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="message"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
