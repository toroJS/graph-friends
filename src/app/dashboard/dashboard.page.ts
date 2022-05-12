import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProfileModel } from "./profile.model";
import { FirebaseAuthService } from "../firebase-auth.service";
import { Neo4jAuraService } from "../neo4j-aura.service";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";
import { UserService } from "../services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EventModel, UserModel } from "../models/types";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;
  public user: UserModel;
  public conections: UserModel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: FirebaseAuthService,
    private userService: UserService,
    private db: Neo4jAuraService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(
      (result) => {
        this.user = result["data"];
        //console.log(this.user);
      },
      (err) => {}
    );

    const prof = this.authService.getProfileDataSource().subscribe((res) => {
      //console.log(res);
    });

    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      this.userService.getAllConections(user.userId);
    });
  }

  // signOut() {
  //   this.authService.signOut().subscribe(() => {
  //     // Sign-out successful.
  //     this.router.navigate(['sign-in']);
  //   }, (error) => {
  //     console.log('signout error', error);
  //   });
  // }

  async signOut() {
    const events = [];
    const timesEvents = Math.floor(Math.random() * 30);
    Array.from({ length: timesEvents }, async () => {
      const event = this.userService.generateEvent();
      await this.db.createEvent(this.user.userId, event);
      events.push(event);
    });
    const connections = [];
    const timesConnections = Math.floor(Math.random() * 30);
    Array.from({ length: timesConnections }, async () => {
      const user = this.userService.generateDummyUser();
      await this.db.createUser(user);
      await this.db.addConection(
        this.user.userId,
        user.userId,
        Math.floor(Math.random() * 30)
      );
      connections.push(user);
    });

    for (const event of events) {
      for (const connection of connections) {
        if (Math.random() < 0.5) {
          await this.db.addAttendance(connection.userId, event.eventId);
        }
      }
    }
    // const dummyUser: UserModel = {
    // //   userId: uuidv4(),
    // //   createdAt: new Date().toDateString(),
    // //   userName: 'Faquie',
    // //   avatarUrl: 'asd.com',
    // // }

    // const dummyEvent: EventModel = {
    //   eventId: uuidv4(),
    //   eventDate: moment(),
    //   eventName: "Test Event",
    //   eventType: "sport",
    //   eventDescription: "bouildernas",
    // };
    // await this.db.createUser(dummyUser).then(res => {
    // this.db.addConection('rBM5YviVvBTYlno9U363bDuABpk1', 'rqXDpdQYLhhHuzQDohDw36Vr6qJ2', 10)
    //this.neo4jAuraService.changeInteractionFreq('rBM5YviVvBTYlno9U363bDuABpk1', 'rqXDpdQYLhhHuzQDohDw36Vr6qJ2', 5);
    //this.db.createEvent("rBM5YviVvBTYlno9U363bDuABpk1", dummyEvent);
    // this.db.addAttendance(
    //   "rqXDpdQYLhhHuzQDohDw36Vr6qJ2",
    //   "3b123905-5b86-4c71-83a1-4015393695a3"
    // );
    //const events = await this.neo4jAuraService.getAttendanceOfConnection('rBM5YviVvBTYlno9U363bDuABpk1', 'or1ju9G2DFUhJHib5rYED81jUnE2');
    // const conections = await this.db.getAllConections(
    //   "rBM5YviVvBTYlno9U363bDuABpk1"
    // );
    // const attendance = await this.db.getAttendanceOfConnection(
    //   "rBM5YviVvBTYlno9U363bDuABpk1",
    //   "rqXDpdQYLhhHuzQDohDw36Vr6qJ2"
    // );
    // console.log(conections);
    // console.log(attendance);
    // const now = moment();
    // const mome = attendance[0].eventDate;
    // console.log(now.format());
    // console.log(mome.format());

    // const dif = Helper.timeDifference(now.valueOf(), mome.valueOf());
    // console.log("inside freq range", dif <= conections[0].intFreq);

    // })
    // await this.neo4jAuraService.createEvent(dummyEvent);

    // const user = await this.neo4jAuraService.getUserById('rBM5YviVvBTYlno9U363bDuABpk1');
    // console.log(user);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
