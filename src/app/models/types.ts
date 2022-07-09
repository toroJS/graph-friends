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
  eventType: EventTypeModel;
  eventDate: string;
  eventName: string;
  eventDescription: string;
  eventImageSrc?: string;
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
  connectionStateEmogi?: string;
  friendSince?: moment.Moment;
};

export type EventModel = {
  eventId: string;
  eventType: EventTypeModel;
  eventDate: moment.Moment;
  eventName: string;
  eventDescription: string;
  eventImageSrc?: string;
  eventDateStatus?: EventDateStatus;
  pastEvent?: boolean;
  image?: any;
};

export type EventTypeModel = ["sport", "eating", "drinking"];
export enum ConnectionState {
  State1 = 1,
  State2,
  State3,
  State4,
  State5,
}

export enum AttendanceStatus {
  invited = 1,
  confirmed,
  declined,
}

export enum EventDateStatus {
  past = 1,
  present,
  future,
}

export enum IntFreq {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export const avatarState = new Map([
  [ConnectionState.State1, "state1"],
  [ConnectionState.State2, "state2"],
  [ConnectionState.State3, "state3"],
  [ConnectionState.State4, "state4"],
  [ConnectionState.State5, "state5"],
]);
