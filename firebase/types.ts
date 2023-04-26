type EatRequest = {
  location: string;
  timestamp: number;
  requester: string;
};

type User = {
  name: string;
  hasActiveRequest: boolean;
  hasPendingMatch: boolean;
};

type Message = {
  id: string[];
  timestamp: number;
  content: string;
  sender: string;
};

type DiningHall = {
  latitude: number;
  longitude: number;
  name: string;
};

type PendingMatch = {
  people: string[];
  location: string;
  timestamp: number;
};

export { EatRequest, User, Message, DiningHall, PendingMatch };
