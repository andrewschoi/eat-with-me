type EatRequest = {
  location: string,
  timestamp: string,
  requester: string
}

type User = {
  name: string,
  activeRequests: number,
}

type Message = {
  id: string[],
  timestamp: string,
  content: string
}

type DiningHall = {
  latitude: number,
  longitude: number,
  name: string
}


export {EatRequest, User, Message, DiningHall};