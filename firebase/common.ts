import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
  Query,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  or,
} from "firebase/firestore";
import { db } from "./config";
import { EatRequest, User, Message, DiningHall, PendingMatch } from "./types";
import { DINING_HALLS } from "./constants";
import * as Location from "expo-location";

const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

const haversineDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
): number => {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const inRadius = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
  rad: number
): boolean => {
  const distance = haversineDistance(lat1, long1, lat2, long2);
  return distance <= rad;
};

const getLocationsInRadius = (locObj: Location.LocationObject): string[] => {
  const latitude = locObj.coords.latitude;
  const longitude = locObj.coords.longitude;

  return DINING_HALLS.filter((diningHall) => {
    const otherLatitude = diningHall.latitude;
    const otherLongitude = diningHall.longitude;
    return inRadius(latitude, longitude, otherLatitude, otherLongitude, 1);
  }).map((diningHall) => diningHall.name);
};

const createRequestsQuery = (loc: string[]): Query | null => {
  if (loc.length > 0)
    return query(collection(db, "requests"), where("location", "in", loc));
  return null;
};

const createUserQuery = (name: string): Query => {
  return query(collection(db, "users"), where("name", "==", name));
};

const createMessageId = (user1: string, user2: string): string => {
  const id: string[] = [user1, user2];
  id.sort();
  return `${id[0]}-${id[1]}`;
};

const createRequestId = (name: string, loc: string): string => {
  return name.concat(loc);
};

const createEatRequests = (loc: string, requester: string): EatRequest => {
  return {
    location: loc,
    timestamp: new Date().valueOf(),
    requester: requester,
  };
};

const createMessage = (
  user1: string,
  user2: string,
  content: string,
  sender: string
): Message => {
  return {
    id: [user1, user2],
    timestamp: new Date().valueOf(),
    content: content,
    sender: sender,
  };
};

const createPendingMatch = (user1: string, user2: string, location: string) => {
  return {
    people: [user1, user2],
    location: location,
    timestamp: new Date().toLocaleDateString(),
  };
};

const pendingMatchConverter = (doc: DocumentData): PendingMatch => {
  return {
    people: doc.data().people,
    location: doc.data().location,
    timestamp: doc.data().timestamp,
  };
};

const requestConverter = (doc: DocumentData): EatRequest => {
  return {
    location: doc.data().location,
    timestamp: doc.data().timestamp,
    requester: doc.data().requester,
  };
};

const userConverter = (doc: DocumentData): User => {
  return {
    name: doc.data().name,
    hasActiveRequest: Boolean(doc.data().hasActiveRequest),
    hasPendingMatch: Boolean(doc.data().hasPendingMatch),
  };
};

const messageConverter = (doc: DocumentData): Message => {
  return {
    id: doc.data().id,
    timestamp: doc.data().timestamp,
    content: doc.data().content,
    sender: doc.data().sender,
  };
};

const addPendingMatch = async (
  user1: string,
  user2: string,
  location: string
): Promise<boolean> => {
  const pendingMatch = createPendingMatch(user1, user2, location);
  const docRef = doc(collection(db, "pendingMatches"));
  const success = await setDoc(docRef, pendingMatch)
    .then(() => true)
    .catch(() => false);
  if (success) {
    const q = query(
      collection(db, "requests"),
      or(where("requester", "==", user1), where("requester", "==", user2))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docu) => deleteDoc(doc(db, "requests", docu.id)));
    setHasActiveRequest(user1, false);
    setHasActiveRequest(user2, false);
    setHasPendingMatch(user1, true);
    setHasPendingMatch(user2, true);
  }
  return success;
};

const getPendingMatch = async (user: string): Promise<PendingMatch | null> => {
  const q = query(
    collection(db, "pendingMatches"),
    where("people", "array-contains", user)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0)
    return querySnapshot.docs.map((doc) => pendingMatchConverter(doc))[0];
  return null;
};

const deletePendingMatch = async (user: string): Promise<void> => {
  const q = query(
    collection(db, "pendingMatches"),
    where("people", "array-contains", user)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.forEach((docu) =>
    deleteDoc(doc(db, "pendingMatches", docu.id))
  );
};

const messageListener = (
  user1: string,
  user2: string,
  handler: (message: Message[]) => any
): (() => void) => {
  const conversationId: string = createMessageId(user1, user2);
  const messageRef = collection(db, `conversations/${conversationId}/messages`);
  const unsubscribe = onSnapshot(messageRef, (querySnapshot) => {
    handler(querySnapshot.docs.map((doc) => messageConverter(doc)));
  });
  return () => unsubscribe();
};

const getMessages = async (
  user1: string,
  user2: string
): Promise<Message[]> => {
  const conversationId: string = createMessageId("user1", "user2");
  const messageRef = collection(db, `conversations/${conversationId}/messages`);
  const querySnapshot = await getDocs(messageRef);
  return querySnapshot.docs.map((doc) => messageConverter(doc));
};

const addMessage = async (
  user1: string,
  user2: string,
  content: string,
  sender: string
): Promise<boolean> => {
  const conversationId: string = createMessageId(user1, user2);
  const messageRef = doc(
    collection(db, `conversations/${conversationId}/messages`)
  );
  const message = createMessage(user1, user2, content, sender);
  const success = setDoc(messageRef, message)
    .then(() => true)
    .catch(() => false);
  return success;
};

const getUser = async (user: string) => {
  const userQuery = createUserQuery(user);
  const querySnapshot = await getDocs(userQuery);
  if (!querySnapshot.empty) {
    return userConverter(querySnapshot.docs[0]);
  }
  return null;
};

const setHasActiveRequest = async (user: string, hasActiveRequest: boolean) => {
  setDoc(
    doc(collection(db, "users"), user),
    { hasActiveRequest: hasActiveRequest },
    { merge: true }
  );
};

const setHasPendingMatch = async (user: string, hasPendingMatch: boolean) => {
  setDoc(
    doc(collection(db, "users"), user),
    { hasPendingMatch: hasPendingMatch },
    { merge: true }
  );
};

const clearPendingMatch = async (
  user: string,
  pendingMatch: PendingMatch | null
): Promise<boolean> => {
  const success = await setDoc(
    doc(collection(db, "users"), user),
    { hasPendingMatch: false, hasActiveRequest: false },
    { merge: true }
  )
    .then(() => true)
    .catch(() => false);

  if (success && pendingMatch !== null) {
    const [user1, user2] = pendingMatch.people;
    await deletePendingMatch(user1);
    addMessage(user1, user2, `${user} has left the chat`, user);
  }
  return success;
};
const addRequest = async (name: string, loc: string): Promise<boolean> => {
  const user = await getUser(name);

  if (user === null || user?.hasActiveRequest) {
    console.log(
      `${name} cannot add a request, as ${name} already has some active request`
    );
    return false;
  }

  const requestId = createRequestId(name, loc);
  const docRef = doc(collection(db, "requests"), requestId);
  const request = createEatRequests(loc, name);
  const success = await setDoc(docRef, request)
    .then(() => true)
    .catch(() => false);
  if (success) {
    setHasActiveRequest(name, true);
  }
  return success;
};

const getReceivers = async (user: string) => {
  const q = query(
    collection(db, "conversations"),
    where("id", "array-contains", user)
  );
  const querySnapshot = await getDocs(q);
  const receivers = querySnapshot.docs
    .map((doc) => messageConverter(doc.data()).id.filter((mem) => mem !== user))
    .flat();
  return receivers;
};

const canAcceptRequest = (user: string, request: EatRequest) => {
  return user !== request.requester;
};

const getRequests = async (loc: string[]): Promise<EatRequest[]> => {
  const requests: EatRequest[] = [];
  const q = createRequestsQuery(loc);
  if (q === null) return [];
  const docs = await getDocs(q);
  docs.forEach((doc) => requests.push(requestConverter(doc)));
  return requests;
};

const requestsListener = (
  loc: string[],
  handler: (request: EatRequest[]) => any
): (() => void) => {
  const q = createRequestsQuery(loc);
  if (q === null) return () => {};
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const requests: EatRequest[] = [];
    querySnapshot.forEach((doc) => requests.push(requestConverter(doc)));
    handler(requests);
  });
  return () => unsubscribe();
};

const createUser = async (name: string): Promise<boolean> => {
  const q = query(collection(db, "users"), where("name", "==", name));
  const querySnapshot = await getDocs(q);
  const userExists = querySnapshot.size > 0;
  if (!userExists) {
    const docRef = doc(collection(db, "users"), name);
    setDoc(docRef, {
      name: name,
      activeRequests: 0,
    });
    return true;
  }
  return false;
};

const userListener = (
  name: string,
  handler: (arg1: User) => any
): (() => void) => {
  const unsub = onSnapshot(doc(db, "users", name), (doc) =>
    handler(userConverter(doc))
  );
  return unsub;
};

const sortMessagesByTimestamp = (messages: Message[]) => {
  const comparator = (msg1: Message, msg2: Message): number => {
    if (msg1.timestamp > msg2.timestamp) return 1;
    else if (msg1.timestamp === msg2.timestamp) return 0;
    else return -1;
  };

  return messages.sort(comparator);
};

export {
  requestsListener,
  getRequests,
  addRequest,
  createUser,
  getUser,
  addMessage,
  messageListener,
  getLocationsInRadius,
  getMessages,
  getReceivers,
  addPendingMatch,
  deletePendingMatch,
  getPendingMatch,
  userListener,
  createPendingMatch,
  canAcceptRequest,
  clearPendingMatch,
  sortMessagesByTimestamp,
};
