import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import * as moment from "moment";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import {
  AttendanceStatus,
  EventDateStatus,
  UserModel,
} from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { EventsService } from "src/app/services/events.service";
import { StorageService } from "src/app/services/storage.service";
import { UserService } from "src/app/services/user.service";
import { InvitationsModalComponent } from "../modals/invitations-modal/invitations-modal.component";

@Component({
  selector: "app-invitations",
  templateUrl: "./invitations.component.html",
  styleUrls: ["./invitations.component.scss"],
})
export class InvitationsComponent implements OnInit, OnDestroy {
  public EventDateStatus = EventDateStatus;
  destroy$: Subject<boolean> = new Subject<boolean>();
  invitations$ = this.userService.invitations$.pipe(
    filter((e) => e !== null),
    map((events) => {
      events.forEach(async (element) => {
        const now = moment();
        var dDiff = now.diff(element.eventDate);
        var iscurrentDate = element.eventDate.isSame(new Date(), "day");
        if (iscurrentDate) {
          element.eventDateStatus = EventDateStatus.present;
        } else if ((element.pastEvent = dDiff > 0)) {
          element.eventDateStatus = EventDateStatus.past;
        } else {
          element.eventDateStatus = EventDateStatus.future;
        }
        if (element.eventImageSrc)
          element.image = await this.storage.getImage(element.eventImageSrc);
      });
      return events;
    })
  );
  conections$ = this.userService.conections$;

  public user: UserModel;
  public AttendanceStatus = AttendanceStatus;

  constructor(
    private userService: UserService,
    private storage: StorageService,
    private modalController: ModalController,
    private neo: Neo4jAuraService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(filter((user) => user !== null, takeUntil(this.destroy$)))
      .subscribe(async (user) => {
        this.user = user;
        if (!this.userService.invitations$.getValue()) {
          this.userService.getInvitations(user.userId);
        }
        //this.userService.getAllCreatedEvents(this.user.userId);
      });
  }

  getCreatedEvents() {}

  async presentEventDetail(event: any) {
    const modal = await this.modalController.create({
      component: InvitationsModalComponent,
      componentProps: {
        event: event,
        userId: this.user.userId,
      },
    });

    await modal.present();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
