import React from "react"
import { EatRequest } from "../../../firebase/types"
import { ScrollView } from "react-native"
import RequestRow from "./requestRow"

const RequestsView = ({ requests }: {requests: EatRequest[]}) => {
  return (
    <ScrollView>
      {requests.map(req => <RequestRow key={req.requester} request={req} />)}
    </ScrollView>
  );
}

export default RequestsView;
