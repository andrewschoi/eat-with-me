import { collection, query, where, onSnapshot, DocumentData, Query, setDoc, doc, getDocs} from "firebase/firestore";
import {db} from "./config";
import { EatRequest, User, Message } from "./types";

const createRequestsQuery = (loc: string) : Query => {
  return query(collection(db, "requests"), where("location", "==", loc));
}

const createUserQuery = (name : string) : Query => {
  return query(collection(db, "users"), where("name", "==", name))
}

const createMessageId = (user1 : User, user2: User) : string => {
  const id: string[] = [user1.name, user2.name];
  id.sort()
  return id.join("")
}

const createEatRequests = (loc: string, requester: string) : EatRequest => {
  return {
    "location": loc,
    "timestamp": new Date().toLocaleTimeString(),
    "requester": requester
  }
}

const createMessage = (user1: User, user2: User, content: string) : Message => {
  return {
    "id": createMessageId(user1, user2),
    "timestamp": new Date().toLocaleTimeString(),
    "content": content
  }
}

const requestConverter = (doc: DocumentData) : EatRequest  => {
  return {
    location: doc.data().location, 
    timestamp: doc.data().timestamp,
    requester: doc.data().requester
  }
}

const userConverter = (doc: DocumentData) : User => {
  return {
    "name": doc.data().name,
    "activeRequests": doc.data().activeRequests
  }
}

const messageConverter = (doc : DocumentData) : Message => {
  return {
    "id": doc.data().id,
    "timestamp": doc.data().timestamp,
    "content": doc.data().content
  }
}

const messageListener = (user1: User, user2: User, handler: (arg1: Message[]) => any) : () => void => {
  const unsubscribe = onSnapshot(collection(db, `conversations/${createMessageId(user1, user2)}`), (querySnapshot) => {
    handler(querySnapshot.docs.map(doc => messageConverter(doc)))
  })
  return () => unsubscribe()
}

const addMessage = async (user1 : User, user2 : User, content: string) : Promise<boolean>=> {
  const docRef = doc(collection(db, `conversations/${createMessageId(user1, user2)}`))
  const message = createMessage(user1, user2, content)
  const success = setDoc(docRef, message).then(() => true).catch(() => false)
  return success
}

const getUser = async (name : string) => {
  const userQuery = createUserQuery(name);
  const querySnapshot = await getDocs(userQuery);
  if (!querySnapshot.empty) {
    return userConverter(querySnapshot.docs[0].data())
  }
  return null
}

const addRequest = async (user: User, loc: string) : Promise<boolean> => {
  const docRef = doc(collection(db, "requests"));
  const request = createEatRequests(loc, user.name)
  const success = setDoc(docRef, request).then(() => true).catch(() => false)
  return success
}

const getRequests = async (loc: string) : Promise<EatRequest[]> => {
  const requests: EatRequest[] = [];
  const docs = await getDocs(createRequestsQuery(loc));
  docs.forEach(doc => requests.push(requestConverter(doc)));
  return requests;
}

const requestsListener = (loc : string, handler : (arg1 : EatRequest[]) => any) : () => void => {
  const unsubscribe = onSnapshot(createRequestsQuery(loc), (querySnapshot) => {
    const requests: EatRequest[] = [];
    querySnapshot.forEach(doc => requests.push(requestConverter(doc)));
    handler(requests)
  })
  return () => unsubscribe()
} 

const createUser = async (name : string) : Promise<boolean> => {
  const q = query(collection(db, "users"), where("name", "==", name));
  const querySnapshot = await getDocs(q)
  const userExists = querySnapshot.size > 0
  if (!userExists) {
    const docRef = doc(collection(db, "users"))
    setDoc(docRef, {
      "name": name,
      "activeRequests": 0
    })
    return true
  }
  return false
}

export {requestsListener, getRequests, addRequest, createUser, getUser, addMessage, messageListener}