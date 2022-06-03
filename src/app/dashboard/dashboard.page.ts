import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseAuthService } from "../firebase-auth.service";
import { Neo4jAuraService } from "../neo4j-aura.service";
import { ModalController } from "@ionic/angular";
import { UserService } from "../services/user.service";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { avatarState, UserModel } from "../models/types";

import { CreateEventModalComponent } from "./modals/create-event-modal/create-event-modal.component";
import { CreateConnectionModalComponent } from "./modals/create-connection-modal/create-connection-modal.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;
  public user: UserModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
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

    this.userService.user$
      .pipe(
        filter((user) => user !== null),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.user = user;
        this.userService.getAllConections(user.userId);
      });
  }

  public goToConnection(connectionUserId: string) {
    this.userService.selectConnection(connectionUserId);
    this.router.navigate(["pages/connection", connectionUserId]);
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
    console.log("start iteration");
    const events = [];
    const timesEvents = this.randomIntFromInterval(2, 7);

    const connections = [];

    for (let i = 0; i < timesEvents; i++) {
      const event = this.userService.generateEvent();
      await this.db.createEvent(this.user.userId, event);
      events.push(event);
    }

    // await Array.from({ length: timesEvents }, async function () {
    //   const event = this.userService.generateEvent();
    //   await this.db.createEvent(this.user.userId, event);
    //   events.push(event);
    // });

    // const sum = await fruitsToGet.reduce(async (sum, fruit) => {
    //   const numFruit = await getNumFruit(fruit)
    //   return sum + numFruit
    // }, 0)

    // console.log(sum)
    // console.log('End')

    //const conections = createEvents(timesEvents);

    const timesConnections = this.randomIntFromInterval(1, 10);

    for (let i = 0; i < timesConnections; i++) {
      const user = this.userService.generateDummyUser();
      await this.db.createUser(user);
      await this.db.addConectionForTestOnly(
        this.user.userId,
        user.userId,
        this.randomIntFromInterval(1, 10)
      );

      connections.push(user);
    }

    console.log(events);
    console.log(connections);

    for (const event of events) {
      for (const connection of connections) {
        if (Math.random() < 0.8) {
          console.log(connection);
          console.log(event);

          await this.db.addAttendance(connection.userId, event.eventId);
        }
      }
    }
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async presentCreateEventModal() {
    const modal = await this.modalController.create({
      component: CreateEventModalComponent,
      componentProps: { userId: this.user.userId, friends$: this.conections$ },
    });

    await modal.present();
  }

  async presentAddFriendModal() {
    const modal = await this.modalController.create({
      component: CreateConnectionModalComponent,
      componentProps: {
        userId: this.user.userId,
        friends$: this.conections$.pipe(
          map((friends) => {
            return friends.map((friend) => friend.email);
          })
        ),
      },
    });

    await modal.present();
  }
}
