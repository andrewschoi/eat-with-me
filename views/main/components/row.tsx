import React from "react"
import {Text, View} from 'react-native';
import {EatRequest} from "../../../firebase/types"

const RequestRow = ({request} : {request: EatRequest}) => {
  return <View><Text>{request.requester}, {request.location}, {request.timestamp}</Text></View>
}

export default RequestRow