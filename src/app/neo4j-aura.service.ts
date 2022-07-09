import { Injectable } from "@angular/core";
import * as moment from "moment";

// import { AngularFireAuth } from '@angular/fire/auth';
// import { Observable, Subject, from } from 'rxjs';
// import { Platform } from '@ionic/angular';
// import { User, auth } from 'firebase/app';
// import { ProfileModel } from './profile/profile.model';
// import { filter, map, take } from 'rxjs/operators';
import neo4j from "neo4j-driver";
import Helper from "./helpers/helpers";
import {
  AttendanceStatus,
  DBEventModel,
  EventModel,
  UserModel,
} from "./models/types";

@Injectable({ providedIn: "root" })
export class Neo4jAuraService {
  uri = "neo4j+s://b4d62e62.databases.neo4j.io";
  user = "neo4j";
  password = "QCiEm5hd9Ai7uukxQkrY222ckOCUTyURJkoOujpvC20";

  constructor() {}

  public async createUser(user: UserModel) {
    console.log("Create User");
    const createUserQuery = `CREATE (p1:Person{userId:$userId, createdAt:$createdAt, userName:$userName, avatarUrl:$avatarUrl, email:$email})`;
    this.write(createUserQuery, user);
  }

  public async addConection(userId: string, friendId: string, intFreq: number) {
    const createConectionQuery = `
        MATCH (p1:Person {userId:$userId}) MATCH (p2:Person{userId:$friendId }) MERGE (p1)-[:BEFRIENDED {intFreq:$intFreq, since:$since}]->(p2)`;
    //replace random date for Date() after testing
    const params = {
      userId: userId,
      friendId: friendId,
      since: new Date().toISOString(),
      intFreq: intFreq,
    };
    this.write(createConectionQuery, params);
  }
  //remove testing only--------------------------
  randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  public async addConectionForTestOnly(
    userId1: string,
    userId2: string,
    intFreq: number
  ) {
    const createConectionQuery = `
        MATCH (p1:Person {userId:$userId1}) MATCH (p2:Person{userId:$userId2 }) MERGE (p1)-[:BEFRIENDED {intFreq:$intFreq, since:$since}]->(p2)`;
    //replace random date for Date() after testing
    const params = {
      userId1: userId1,
      userId2: userId2,
      since: this.randomDate(new Date(2022, 4, 1), new Date()).toDateString(),
      intFreq: intFreq,
    };
    this.write(createConectionQuery, params);
  }
  ////--------------------------------------------------------------

  public async getAllConections(userId) {
    const getAllConectionsQuery = `MATCH (p:Person {userId:$userId})-[rel:BEFRIENDED]->(f:Person) RETURN rel.intFreq AS intFreq, rel.since AS since, f AS conections`;
    //MATCH (p:Person {userId:'rBM5YviVvBTYlno9U363bDuABpk1'})-[rel:BEFRIENDED]->(a:Person) RETURN rel.intFreq AS freq, p AS person
    const params = { userId: userId };

    const driver = this.getDriver();
    const session = driver.session();

    try {
      const readResult = await session.readTransaction((tx) =>
        tx.run(getAllConectionsQuery, params)
      );
      const results: UserModel[] = [];
      readResult.records.forEach((record) => {
        //console.log(Date.parse((record.get("conections").properties).createdAt));

        results.push({
          ...record.get("conections").properties,
          ...{
            intFreq: record.get("intFreq"),
            friendSince: moment(record.get("since")),
          },
        });
      });
      console.log("results");
      console.log(results);

      return results;
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  }

  public async changeInteractionFreq(
    userId1: string,
    userId2: string,
    intFreq: number
  ) {
    const changeIntFreqQuery = `
        MATCH  (a:Person {userId:$userId1})-[rel:BEFRIENDED]->(b:Person {userId:$userId2}) set rel.intFreq = $intFreq`;
    const params = { userId1: userId1, userId2: userId2, intFreq: intFreq };
    this.write(changeIntFreqQuery, params);
  }

  public async updateAvatar(userId: string, avatarUrl: string) {
    const updateAvatarQuery = `
    MATCH  (p:Person {userId:$userId}) set p.avatarUrl = $avatarUrl`;
    const params = { userId: userId, avatarUrl: avatarUrl };
    this.write(updateAvatarQuery, params);
  }

  public async createEvent(userId: string, event: DBEventModel) {
    console.log("Create Event");
    const createEventQuery = ` MATCH(p: Person { userId:$userId }) CREATE(e:Event {eventId:$eventId, createdBy:$userId, eventType:$eventType, eventDate:$eventDate, eventName:$eventName, eventDescription:$eventDescription, eventImageSrc:$eventImageSrc}) MERGE(p)-[:CREATED]->(e)
        `;
    const params = { userId: userId, ...event };
    await this.write(createEventQuery, params);
    return event.eventId;
  }

  public async addAttendance(userId: string, eventId: string) {
    const addAttendanceQuery = `MATCH(e:Event {eventId: $eventId}) MATCH (p:Person {userId: $userId }) MERGE (p)-[:ATTENDED {status: 1}]->(e)`;
    const params = { userId: userId, eventId: eventId };
    this.write(addAttendanceQuery, params);

    //MATCH (p1:Person {userId:$userId}) MATCH (p2:Person{userId:$friendId }) MERGE (p1)-[:BEFRIENDED {intFreq:$intFreq, since:$since}]->(p2)`;
  }

  public async changeAttendanceStatus(
    userId: string,
    eventId: string,
    status: number
  ) {
    const changeAttendanceStatusQuery = `
        MATCH  (a:Person {userId:$userId})-[rel:ATTENDED]->(e:Event {eventId:$eventId}) set rel.status = $status`;
    const params = { userId: userId, eventId: eventId, status: status };
    this.write(changeAttendanceStatusQuery, params);
  }

  public async getAllEventsCreatedByUserId(userId: string) {
    const driver = this.getDriver();
    const session = driver.session();

    try {
      const readQuery = `MATCH (p:Person {userId : $userId})-[:CREATED]->(e:Event) RETURN e AS event`;
      const readResult = await session.readTransaction((tx) =>
        tx.run(readQuery, { userId: userId })
      );
      const results = [];
      readResult.records.forEach((record) => {
        const event = record.get("event").properties;
        event.eventDate = moment(event.eventDate);
        results.push(event as EventModel);
      });
      const sortedResults = Helper.sortByDate(results, "eventDate", "desc");

      return sortedResults || undefined;
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  }

  //RETURN rel.intFreq AS intFreq, rel.since AS since, f AS conections
  //   const readResult = await session.readTransaction((tx) =>
  //   tx.run(getAllConectionsQuery, params)
  // );
  // const results: UserModel[] = [];
  // readResult.records.forEach((record) => {
  //   //console.log(Date.parse((record.get("conections").properties).createdAt));

  //   results.push({
  //     ...record.get("conections").properties,
  //     ...{
  //       intFreq: record.get("intFreq"),
  //       friendSince: moment(record.get("since")),
  //     },
  //   });
  // });
  public async getAttendanceOfConnection(
    userId: string,
    conectionUserId: string
  ) {
    const getAttendanceOfConnectionQuery = `MATCH (p:Person {userId:$conectionUserId})-[att:ATTENDED]->(e) MATCH (d:Person {userId:$userId})-[:CREATED]->(e)  RETURN att.status AS status, e AS event`;
    const params = { conectionUserId: conectionUserId, userId: userId };
    const driver = this.getDriver();
    const session = driver.session();
    try {
      const readResult = await session.readTransaction((tx) =>
        tx.run(getAttendanceOfConnectionQuery, params)
      );
      const results: EventModel[] = [];
      readResult.records.forEach((record) => {
        const event = record.get("event").properties;
        event.attendanceStatus = (record.get("status") ||
          1) as AttendanceStatus;
        event.eventDate = moment(event.eventDate);
        results.push(record.get("event").properties);
      });

      const sortedResults = Helper.sortByDate(results, "eventDate", "desc");
      //console.log(sortedResults);

      return sortedResults;
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  }

  public async getInvitations(userId: string) {
    const getAttendanceOfConnectionQuery = `MATCH (p:Person {userId:$userId})-[att:ATTENDED]->(e)  RETURN att.status AS status, e AS event`;
    const params = { userId: userId };
    const driver = this.getDriver();
    const session = driver.session();
    try {
      const readResult = await session.readTransaction((tx) =>
        tx.run(getAttendanceOfConnectionQuery, params)
      );
      const results: EventModel[] = [];
      readResult.records.forEach((record) => {
        const event = record.get("event").properties;
        event.attendanceStatus = (record.get("status") ||
          1) as AttendanceStatus;
        event.eventDate = moment(event.eventDate);
        results.push(record.get("event").properties);
      });

      const sortedResults = Helper.sortByDate(results, "eventDate", "desc");
      //console.log(sortedResults);

      return sortedResults;
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  }

  public async getUserById(userId: string) {
    //console.log("Get User by Id");
    const driver = this.getDriver();
    const session = driver.session();
    try {
      const readQuery = `MATCH (p:Person {userId : $userId})
                                 RETURN p AS user`;
      const readResult = await session.readTransaction((tx) =>
        tx.run(readQuery, { userId: userId })
      );
      const results = [];
      readResult.records.forEach((record) => {
        results.push(record.get("user"));
      });
      return (results[0]?.properties as UserModel) || undefined;
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  }

  public async getUserByEmail(email: string) {
    //console.log("Get User by Id");
    const driver = this.getDriver();
    const session = driver.session();
    try {
      const readQuery = `MATCH (p:Person {email : $email})
                                 RETURN p AS user`;
      const readResult = await session.readTransaction((tx) =>
        tx.run(readQuery, { email: email })
      );
      const results = [];
      readResult.records.forEach((record) => {
        results.push(record.get("user"));
      });
      return (results[0]?.properties as UserModel) || undefined;
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }
    await driver.close();
  }

  //DB Methods

  private async write(writeQuery: string, params?: any) {
    console.log("WRITE query");
    const driver = this.getDriver();
    const session = driver.session();
    try {
      await session.writeTransaction((tx) => tx.run(writeQuery, params));
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      await session.close();
    }

    await driver.close();
  }

  private getDriver() {
    return neo4j.driver(this.uri, neo4j.auth.basic(this.user, this.password));
  }
}
