import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import * as moment from "moment";
import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { EventDateStatus, UserModel } from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { EventsService } from "src/app/services/events.service";
import { StorageService } from "src/app/services/storage.service";
import { UserService } from "src/app/services/user.service";
import { ActivityModalComponent } from "../modals/activity-modal/activity-modal.component";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;
  events$ = this.userService.createdEvents$.pipe(
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

        // element.pastEvent = dDiff > 0 ? true : false;
        if (element.eventImageSrc)
          element.image = await this.storage.getImage(element.eventImageSrc);
      });
      return events;
    })
  );
  public user: UserModel;
  public EventDateStatus = EventDateStatus;

  constructor(
    private userService: UserService,
    private storage: StorageService,
    private modalController: ModalController,
    private neo: Neo4jAuraService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(filter((user) => user !== null))
      .subscribe(async (user) => {
        this.user = user;
        this.userService.getAllCreatedEvents(this.user.userId);
      });
  }

  getCreatedEvents() {}

  async presentEventDetail(event: any) {
    const modal = await this.modalController.create({
      component: ActivityModalComponent,
      componentProps: {
        event: event,
      },
    });

    await modal.present();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
