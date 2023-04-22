import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Main from "./views/main";
import Messaging from "./views/messaging";
import { UserProvider } from "./contexts/userContext";

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="main"
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen
            name="main"
            component={Main}
            options={{
              title: "Main",
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name="message"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="message"
            component={Messaging}
            options={{
              title: "Messaging",
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
