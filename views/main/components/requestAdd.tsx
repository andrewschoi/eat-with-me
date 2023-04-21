import React, {useEffect, useContext} from "react"
import userContext from "../../../contexts/userContext"
import * as BE from "../../../firebase/common"
import { View } from "react-native"

export default function RequestModal() {
  const UserContext = useContext(userContext)
  
  const handleRequestSend = (location: string) => {
    if (!UserContext?.user) return
    if (!UserContext.locations.includes(location)) return
    BE.addRequest(UserContext.user, location)
  }

  return <View></View>
}