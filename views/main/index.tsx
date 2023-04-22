import React, { useState, useEffect, useContext } from "react";
import userContext from "../../contexts/userContext";
import * as BE from "../../firebase/common";
import { EatRequest } from "../../firebase/types";
import { createStackNavigator } from "@react-navigation/stack";
import RequestView from "./components/requestView";
import RequestDetail from "./components/requestDetail";
import { View, Text } from "react-native";
const Stack = createStackNavigator();

const Main = () => {
  const UserContext = useContext(userContext);
  const [openRequests, setOpenRequests] = useState<EatRequest[]>([]);

  const handleListenerChange = (requests: EatRequest[], loc: string) => {
    const openReq = openRequests
      .filter((req) => req.location !== loc)
      .concat(requests);
    setOpenRequests(() => openReq);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const requests: Promise<EatRequest[]>[] = [];
      if (UserContext?.locations) {
        UserContext.locations.forEach((loc) =>
          requests.push(BE.getRequests(loc))
        );
      }

      const openReq = (await Promise.all(requests)).flat();
      setOpenRequests(() => openReq);
    };

    const createListeners = () => {
      if (UserContext?.locations) {
        const listeners = UserContext.locations.map((loc) =>
          BE.requestsListener(loc, handleListenerChange)
        );
        return () => listeners.forEach((unsub) => unsub());
      }
      return () => {
        return;
      };
    };
    const unsubscribeListeners = createListeners();
    fetchRequests();
    return () => unsubscribeListeners();
  }, [UserContext?.locations]);

  return (
    <Stack.Navigator initialRouteName="Requests">
      <Stack.Screen
        name={"Requests"}
        children={(props) => (
          <RequestView openRequests={openRequests} {...props} />
        )}
      />
      <Stack.Screen
        name={"Detail"}
        children={(props) => <RequestDetail request={null} {...props} />}
      />
    </Stack.Navigator>
  );
};

export default Main;
