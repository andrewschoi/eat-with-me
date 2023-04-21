import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Main from "./views/main";
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
              title: "Main Page",
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
