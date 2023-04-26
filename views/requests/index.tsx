import React, { useState, useRef, useEffect, useContext } from "react";
import userContext from "../../contexts/userContext";
import * as BE from "../../firebase/common";
import { EatRequest } from "../../firebase/types";
import { createStackNavigator } from "@react-navigation/stack";
import RequestView from "./components/requestView";
import RequestDetail from "./components/requestDetail";
import RequestForm from "./components/requestForm";
import MatchView from "./components/matchView";
const Stack = createStackNavigator();

const Requests = () => {
  const UserContext = useContext(userContext);
  const [openRequests, setOpenRequests] = useState<EatRequest[]>([]);

  const handleListenerChange = (requests: EatRequest[]) => {
    setOpenRequests(() => requests);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (UserContext?.locations) {
        const requests = await BE.getRequests(UserContext.locations);
        setOpenRequests(() => requests);
      }
    };

    const createListeners = () => {
      if (UserContext?.locations) {
        const unsub = BE.requestsListener(
          UserContext.locations,
          handleListenerChange
        );
        return () => unsub();
      }
      return () => {};
    };
    const unsubscribeListeners = createListeners();
    fetchRequests();
    return () => unsubscribeListeners();
  }, [UserContext?.locations]);

  if (UserContext?.user?.hasPendingMatch) return <MatchView />;

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
        children={(props) => <RequestDetail {...props} />}
      />
      <Stack.Screen
        name={"Form"}
        children={(props) => <RequestForm {...props} />}
      />
    </Stack.Navigator>
  );
};

export default Requests;
