import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import {db} from "./config";
import { EatRequest } from "./types";

const q = query(collection(db, "requests"), where("location", "==", "morrison"))

const requestConverter = (doc: DocumentData) : EatRequest  => {
  return {
    location: doc.data().location, 
    time: doc.data().time,
    requester: doc.data().requester
  }
}

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const requests: EatRequest[] = [];
  querySnapshot.forEach(doc => requests.push(requestConverter(doc)));
})
