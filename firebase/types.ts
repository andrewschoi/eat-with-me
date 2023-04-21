type EatRequest = {
  location: string,
  timestamp: string,
  requester: string
}

type User = {
  name: string,
  activeRequests: string,
}

type Message = {
  id: string,
  timestamp: string,
  content: string
}

export {EatRequest, User, Message};