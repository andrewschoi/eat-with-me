import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData, Query } from "firebase/firestore";
import {db} from "./config";
import { EatRequest } from "./types";

const createQuery = (loc: string) : Query => {
  return query(collection(db, "location", "==", loc));
}

const requestConverter = (doc: DocumentData) : EatRequest  => {
  return {
    location: doc.data().location, 
    time: doc.data().time,
    requester: doc.data().requester
  }
}

const requestsListener = (query : Query, handler : (arg1 : EatRequest[]) => any) : () => void => {
  const unsubscribe = onSnapshot(query, (querySnapshot) => {
    const requests: EatRequest[] = [];
    querySnapshot.forEach(doc => requests.push(requestConverter(doc)));
    handler(requests);
  })
  return () => unsubscribe()
} 

