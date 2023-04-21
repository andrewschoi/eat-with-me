import React, {useState, useEffect} from "react"
import {Text, View} from 'react-native';
import RequestView from "./components/requestView";
import * as Location from "expo-location"

import { requestsListener, getRequests } from "../../firebase/common";
import { EatRequest } from "../../firebase/types";

const Main = () => {
  const [unmatchedReq, setUnmatchedReq] = useState<EatRequest[]>([])
  const [location, setLocation] = useState<Location.LocationObject>()

  const handleSnapshotChange = (requests : EatRequest[]) => {
    setUnmatchedReq(requests)
  }

  useEffect(() => { 
    const fetchRequests = async () => {
      const current_req = await getRequests("morrison");
      setUnmatchedReq(() => current_req);
    }
    const getPermissions = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return
      }
      const currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
    }

    getPermissions();
    fetchRequests();
    const unsub = requestsListener("morrison", handleSnapshotChange);
    return () => unsub()
  }, [])

  return <View>
    {RequestView(unmatchedReq)}
  </View>
}

export default Main;