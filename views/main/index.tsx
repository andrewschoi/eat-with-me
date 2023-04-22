import React, {useState, useEffect, useContext} from "react"
import RequestView from "./components/requestView";
import userContext from "../../contexts/userContext";
import {SafeAreaView} from "react-native"
import * as BE from "../../firebase/common";
import { EatRequest } from "../../firebase/types";


const Main = () => {
  const UserContext = useContext(userContext)
  const [openRequests, setOpenRequests] = useState<EatRequest[]>([])

  const handleListenerChange = (requests : EatRequest[], loc: string) => {
    const openReq = openRequests.filter(req => req.location !== loc).concat(requests);
    setOpenRequests(() => openReq)
  }

  useEffect(() => { 
    const fetchRequests = async () => {
      const requests: Promise<EatRequest[]>[] = []
      if (UserContext?.locations) {
        UserContext.locations.forEach(loc => requests.push(BE.getRequests(loc)))
      }
      
      const openReq = (await Promise.all(requests)).flat()
      setOpenRequests(() => openReq);
    }

    const createListeners = () => {
      if (UserContext?.locations) {
        const listeners = UserContext.locations.map(loc => BE.requestsListener(loc, handleListenerChange))
        return () => listeners.forEach(unsub => unsub())
      }
      return () => {return}
    }
    const unsubscribeListeners = createListeners()
    fetchRequests();
    
    return () => unsubscribeListeners()
  }, [UserContext?.locations])

  return <SafeAreaView>
    <RequestView requests={openRequests}/>
    </SafeAreaView>
}

export default Main;