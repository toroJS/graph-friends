import { Injectable } from "@angular/core";
import * as moment from "moment";
import { BehaviorSubject, Subject } from "rxjs";
import { FirebaseAuthService } from "../firebase-auth.service";
import Helper from "../helpers/helpers";
import {
  avatarState,
  DBEventModel,
  DBUserModel,
  EventModel,
  UserModel,
} from "../models/types";
import { Neo4jAuraService } from "../neo4j-aura.service";
import { v4 as uuidv4 } from "uuid";
import { names } from "../helpers/mockData";
import { ProfileModel } from "../profile/profile.model";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: "root" })
export class UserService {
  public user$ = new BehaviorSubject<UserModel>(null);
  public conections$ = new BehaviorSubject<UserModel[]>(null);
  public createdEvents$ = new BehaviorSubject<EventModel[]>(null);
  public selectedConnectionId$ = new BehaviorSubject<string>(null);

  constructor(
    private authService: FirebaseAuthService,
    private db: Neo4jAuraService,
    private storage: StorageService
  ) {
    this.authService
      .getProfileDataSource()
      .subscribe(async (fireUser: ProfileModel) => {
        //fireUser is the Auth User from Firebase
        //user is the saved user in Neo4j
        const user = await this.db.getUserById(fireUser.uid);
        const userState = {
          userId: fireUser.uid,
          createdAt: user.createdAt,
          userName: user.userName || fireUser.name,
          email: user.email || fireUser.email,
          avatarUrl: user.avatarUrl || fireUser.image,
          phoneNumber: user.phoneNumber || fireUser.phoneNumber,
        };

        this.user$.next(userState);
      });
  }

  public async saveAvatar(userId, file) {
    if (file) {
      const path = `avatars/${userId}`;
      await this.db.updateAvatar(userId, path);
      await this.storage.uploadFile(path, file);
    }
  }

  public async getAvatar(path: string) {
    return await this.storage.getImage(path);
  }

  public async getAllConections(userId: string) {
    const conections = await this.db.getAllConections(userId);
    // conections.map(async (connection) => {
    //   connection.eventsAttended = await this.db.getAttendanceOfConnection(
    //     userId,
    //     connection.userId
    //   );
    //   connection.connectionState = this.getConnectionState(
    //     connection.intFreq,
    //     connection.eventsAttended[0]?.eventDate || connection.friendSince
    //   );
    //   connection.connectionStateEmogi = avatarState.get(
    //     connection.connectionState
    //   );
    // });
    console.log(conections);

    this.conections$.next(conections);
  }

  public async getAllCreatedEvents(userId: string) {
    const events = await this.db.getAllEventsCreatedByUserId(userId);
    this.createdEvents$.next(events);
  }

  public getConnectionState(intFreq: number, lastEventDate: moment.Moment) {
    const now = moment();
    const diff = Helper.timeDifference(now.valueOf(), lastEventDate.valueOf());
    const connectionState = Helper.calculateConnectionState(diff, intFreq);
    return connectionState;
  }

  public selectConnection(connectionUserId: string) {
    //console.log("triger selection");

    this.selectedConnectionId$.next(connectionUserId);
  }

  public unselectConnection() {
    this.selectedConnectionId$.complete();
  }

  ///Mock Generators
  public generateDummyUser(): DBUserModel {
    return {
      avatarUrl: uuidv4(),
      createdAt: this.randomDate(
        new Date(2021, 5, 1),
        new Date(2022, 4, 1)
      ).toDateString(),
      email: this.randomEmail(),
      userId: uuidv4(),
      userName: this.generateName(),
    };
  }

  public generateEvent(): DBEventModel {
    return {
      eventId: uuidv4(),
      eventType: this.pickRandom(["sport", "eating", "drinking"]),
      eventDate: this.randomDate(
        new Date(2022, 3, 1),
        new Date()
      ).toDateString(),
      eventName: this.generateName() + "Big Event",
      eventDescription: "no description",
    };
  }

  generateName() {
    const name = this.pickRandom(names);
    return name;
  }

  pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  randomEmail() {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    let string = "";
    for (var ii = 0; ii < 15; ii++) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string + "@gmail.com";
  }
}
