type EatRequest = {
  location: string;
  timestamp: string;
  requester: string;
};

type User = {
  name: string;
  hasActiveRequest: boolean;
  hasPendingMatch: boolean;
};

type Message = {
  id: string[];
  timestamp: string;
  content: string;
};

type DiningHall = {
  latitude: number;
  longitude: number;
  name: string;
};

type PendingMatch = {
  people: string[];
  location: string;
  timestamp: string;
};

export { EatRequest, User, Message, DiningHall, PendingMatch };
