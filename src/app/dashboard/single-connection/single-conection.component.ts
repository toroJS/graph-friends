import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Neo4jAuraService } from "../../neo4j-aura.service";
import { UserService } from "../../services/user.service";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { avatarState, UserModel } from "../../models/types";
import * as moment from "moment";
import { StorageService } from "src/app/services/storage.service";
import Helper from "src/app/helpers/helpers";

@Component({
  selector: "app-single-conection",
  templateUrl: "./single-conection.component.html",
  styleUrls: ["./single-conection.component.scss"],
})
export class SingleConectionComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;

  public user: UserModel;
  public selectedConnection: UserModel;
  public showFullEventList = false;
  public goalInteraction: number;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private db: Neo4jAuraService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(filter((user) => user !== null))
      .subscribe((user) => {
        console.log(user);

        this.user = user;
        this.route.params.subscribe((params: Params) => {
          const connectionUserId = params["connectionUserId"];
          this.conections$.subscribe(async (connections) => {
            if (!connections) {
              await this.userService.getAllConections(user.userId);
            } else {
              this.selectedConnection = connections.filter(
                (connection) => connection.userId === connectionUserId
              )[0];
              if (!this.selectedConnection?.eventsAttended) {
                this.selectedConnection.eventsAttended =
                  await this.db.getAttendanceOfConnection(
                    this.user.userId,
                    this.selectedConnection.userId
                  );
              }
              if (this.selectedConnection?.eventsAttended?.length > 0) {
                this.selectedConnection?.eventsAttended.forEach(
                  async (element) => {
                    const now = moment();
                    var dDiff = now.diff(element.eventDate);
                    element.pastEvent = dDiff > 0 ? true : false;
                    if (element.eventImageSrc)
                      element.image = await this.storage.getImage(
                        element.eventImageSrc
                      );
                  }
                );
              }
              this.goalInteraction = this.selectedConnection.intFreq;
              const lastEventDate =
                this.selectedConnection.eventsAttended?.length > 0
                  ? this.selectedConnection.eventsAttended?.filter((e) => {
                      console.log(e);
                      console.log(Helper.isBeforeNow(e.eventDate));
                      return Helper.isBeforeNow(e.eventDate);
                    })[0]?.eventDate
                  : this.selectedConnection.friendSince;
              this.selectedConnection.connectionState =
                this.userService.getConnectionState(
                  this.selectedConnection.intFreq,
                  lastEventDate
                );
              this.selectedConnection.connectionStateEmogi = avatarState.get(
                this.selectedConnection.connectionState
              );
            }
          });
        });
      });
  }

  public formatGoalInteraction(value) {
    const result = Helper.goalInteraction(value) || "Every " + value + " days";

    return result;
  }

  changeIntercationFreq() {
    console.log(this.goalInteraction);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
