import { collection, query, where, onSnapshot, DocumentData, Query, setDoc, doc, getDocs} from "firebase/firestore";
import {db} from "./config";
import { EatRequest } from "./types";

const createQuery = (loc: string) : Query => {
  return query(collection(db, "requests"), where("location", "==", loc));
}

const requestConverter = (doc: DocumentData) : EatRequest  => {
  return {
    location: doc.data().location, 
    time: doc.data().time,
    requester: doc.data().requester
  }
}

const addRequest = async (request: EatRequest) => {
  const docRef = doc(collection(db, "requests"));
  setDoc(docRef, {
    "location": request.location,
    "time": request.time,
    "requester": request.requester
  })
}

const getRequests = async (loc: string) : Promise<EatRequest[]> => {
  const requests: EatRequest[] = [];
  const docs = await getDocs(createQuery(loc));
  docs.forEach(doc => requests.push(requestConverter(doc)));
  return requests;
}

const requestsListener = (loc : string, handler : (arg1 : EatRequest[]) => any) : () => void => {
  const unsubscribe = onSnapshot(createQuery(loc), (querySnapshot) => {
    const requests: EatRequest[] = [];
    querySnapshot.forEach(doc => requests.push(requestConverter(doc)));
    handler(requests)
  })
  return () => unsubscribe()
} 

export {requestsListener, getRequests, addRequest}