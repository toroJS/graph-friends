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
import { DBEventModel, EventModel, UserModel } from "./models/types";

@Injectable({ providedIn: "root" })
export class Neo4jAuraService {
  uri = "neo4j+s://b4d62e62.databases.neo4j.io";
  user = "neo4j";
  password = "QCiEm5hd9Ai7uukxQkrY222ckOCUTyURJkoOujpvC20";

  constructor() {}

  // public async backend() {
  //     console.log('log backend');

  //     const uri = 'neo4j+s://b4d62e62.databases.neo4j.io';
  //     const user = 'neo4j';
  //     const password = 'QCiEm5hd9Ai7uukxQkrY222ckOCUTyURJkoOujpvC20';

  //     const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  //     const session = driver.session()

  //     const person1Name = 'Alice'
  //     const person2Name = 'David'

  //     try {
  //         // To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
  //         // The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
  //         const writeQuery = `MERGE (p1:Person { name: $person1Name })
  //                               MERGE (p2:Person { name: $person2Name })
  //                               MERGE (p1)-[:KNOWS]->(p2)
  //                               RETURN p1, p2`

  //         // Write transactions allow the driver to handle retries and transient errors
  //         const writeResult = await session.writeTransaction(tx =>
  //             tx.run(writeQuery, { person1Name, person2Name })
  //         )
  //         writeResult.records.forEach(record => {
  //             const person1Node = record.get('p1')
  //             const person2Node = record.get('p2')
  //             console.log(
  //                 `Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`
  //             )
  //         })

  //         const readQuery = `MATCH (p:Person)
  //                              WHERE p.name = $personName
  //                              RETURN p.name AS name`
  //         const readResult = await session.readTransaction(tx =>
  //             tx.run(readQuery, { personName: person1Name })
  //         )
  //         readResult.records.forEach(record => {
  //             console.log(`Found person: ${record.get('name')}`)
  //         })
  //     } catch (error) {
  //         console.error('Something went wrong: ', error)
  //     } finally {
  //         await session.close()
  //     }

  //     // Don't forget to close the driver connection when you're finished with it
  //     await driver.close()
  // }

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

  public async createEvent(userId: string, event: DBEventModel) {
    console.log("Create Event");
    const createEventQuery = ` MATCH(p: Person { userId:$userId }) CREATE(e:Event {eventId:$eventId, eventType:$eventType, eventDate:$eventDate, eventName:$eventName, eventDescription:$eventDescription}) MERGE(p)-[:CREATED]->(e)
        `;
    const params = { userId: userId, ...event };
    await this.write(createEventQuery, params);
    return event.eventId;
  }

  public async addAttendance(userId: string, eventId: string) {
    const addAttendanceQuery = `MATCH(e:Event {eventId: $eventId}) MATCH (p:Person {userId: $userId }) MERGE (p)-[:ATTENDED]->(e)`;
    const params = { userId: userId, eventId: eventId };
    this.write(addAttendanceQuery, params);
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

  public async getAttendanceOfConnection(
    userId: string,
    conectionUserId: string
  ) {
    const getAttendanceOfConnectionQuery = `MATCH (p:Person {userId:$conectionUserId})-[:ATTENDED]->(e) MATCH (d:Person {userId:$userId})-[:CREATED]->(e)  RETURN e AS event`;
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
        event.eventDate = moment(event.eventDate);
        results.push(record.get("event").properties);
      });

      const sortedResults = Helper.sortByDate(results, "eventDate", "desc");

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
