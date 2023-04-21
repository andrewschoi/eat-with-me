import React from "react"
import { EatRequest } from "../../../firebase/types"
import { ScrollView } from "react-native"
import RequestRow from "./row"

const RequestsView = (requests: EatRequest[]) => {
  return <ScrollView>
    {requests.map(req => RequestRow(req))}
  </ScrollView>
}

export default RequestsView