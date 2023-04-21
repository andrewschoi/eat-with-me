import React, {useState, useEffect} from "react"
import {Text, View} from 'react-native';

import { requestsListener, getRequests } from "../../firebase/common";
import { EatRequest } from "../../firebase/types";

const Main = () => {
  const [unmatchedReq, setUnmatchedReq] = useState<EatRequest[]>([])

  const handleSnapshotChange = (requests : EatRequest[]) => {
    setUnmatchedReq(requests)
  }

  useEffect(() => { 
    const fetchRequests = async () => {
      const current_req = await getRequests("morrison");
      setUnmatchedReq(() => current_req);
    }
    fetchRequests();
    const unsub = requestsListener("morrison", handleSnapshotChange);
    return () => unsub()
  }, [])

  return <View>
  </View>
}

export default Main;