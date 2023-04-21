import React from "react"
import {Text, View} from 'react-native';
import {EatRequest} from "../../../firebase/types"
import * as BE from "../../../firebase/common"

const RequestRow = ({request} : {request: EatRequest}) => {
  const handleAcceptRequest = (req: EatRequest) => {
    BE.removeRequest(req)
  } 

  return <View><Text>{request.requester}, {request.location}, {request.timestamp}</Text></View>
}

export default RequestRow