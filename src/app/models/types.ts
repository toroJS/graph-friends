import * as moment from "moment";
export type DBUserModel = {
  avatarUrl: string;
  createdAt: string;
  email: string;
  userId: string;
  userName: string;
};

export type DBEventModel = {
  eventId: string;
  eventType: "sport" | "eating" | "drinking";
  eventDate: string;
  eventName: string;
  eventDescription: string;
};

export type UserModel = {
  userId: string;
  createdAt: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  intFreq?: number;
  eventsAttended?: EventModel[];
  connectionState?: any;
  friendSince?: moment.Moment;
};

export type EventModel = {
  eventId: string;
  eventType: "sport" | "eating" | "drinking";
  eventDate: moment.Moment;
  eventName: string;
  eventDescription: string;
};
