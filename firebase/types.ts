type EatRequest = {
  location: string,
  time: string,
  requester: string
}

type User = {
  name: String,
  activeRequests: String,
}

export {EatRequest, User};