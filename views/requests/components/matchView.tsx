import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, Text } from "react-native";
import { PendingMatch } from "../../../firebase/types";
import userContext from "../../../contexts/userContext";
import * as BE from "../../../firebase/common";

const MatchView = () => {
  const UserContext = useContext(userContext);
  const [pendingMatch, setPendingMatch] = useState<PendingMatch | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (UserContext !== null && UserContext.user !== null) {
        const pendingMatch = await BE.getPendingMatch(UserContext.user.name);
        setPendingMatch(pendingMatch);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <Text>{pendingMatch?.people[0]}</Text>
      <Text>{pendingMatch?.people[1]}</Text>
      <Text>{pendingMatch?.location}</Text>
      <Text>{pendingMatch?.timestamp}</Text>
    </SafeAreaView>
  );
};

export default MatchView;
