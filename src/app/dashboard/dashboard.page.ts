import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseAuthService } from "../firebase-auth.service";
import { Neo4jAuraService } from "../neo4j-aura.service";
import { ModalController } from "@ionic/angular";
import { UserService } from "../services/user.service";
import { Subject } from "rxjs";
import { filter, map, takeUntil, isEmpty } from "rxjs/operators";
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
      },
      (err) => {}
    );

    const prof = this.authService.getProfileDataSource().subscribe((res) => {});

    this.userService.user$
      .pipe(
        filter((user) => user !== null),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.user = user;

        if (!this.userService.conections$.getValue()) {
          this.userService.getAllConections(user.userId);
        }
      });
  }

  public goToConnection(connectionUserId: string) {
    this.userService.selectConnection(connectionUserId);
    this.router.navigate(["pages/connection", connectionUserId]);
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
