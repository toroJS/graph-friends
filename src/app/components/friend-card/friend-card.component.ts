import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { EMPTY, interval, of } from "rxjs";
import { catchError, debounce, map } from "rxjs/operators";
import Helper from "src/app/helpers/helpers";
import { AttendanceStatus, avatarState } from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { UserService } from "src/app/services/user.service";
import { VisibilityService } from "src/app/services/visibility.service";

@Component({
  selector: "app-friend-card",
  templateUrl: "./friend-card.component.html",
  styleUrls: ["./friend-card.component.scss"],
})
export class FriendCardComponent implements OnInit {
  @Input() friend: any;
  @Input() userId: string;
  @Output() goToSingleFriend = new EventEmitter<string>();
  public goalInteraction: string;
  public loading: boolean;
  public defaultAvatar = "../../../assets/avatar/avatar-default.png";
  public avatar$: any;
  public dataLoaded = false;

  constructor(
    private visibilityService: VisibilityService,
    private userService: UserService,
    private db: Neo4jAuraService,
    private host: ElementRef
  ) {}

  ngOnInit() {
    this.loading = true;
    const inSight$ = this.visibilityService.elementInSight(this.host);
    inSight$
      .pipe(debounce((i: any) => interval(100 * i)))
      .subscribe((visible) => {
        if (visible && !this.dataLoaded) {
          this.getExtraFriendData();
        }
      });
  }

  public handleGoToSingleFriend() {
    this.goToSingleFriend.emit(this.friend.userId);
  }

  public async getExtraFriendData() {
    this.friend.eventsAttended = await this.db.getAttendanceOfConnection(
      this.userId,
      this.friend.userId
    );
    console.log("events attended");
    console.log(this.friend.friendSince);

    console.log(this.friend.eventsAttended);
    const pastEvents = this.friend.eventsAttended?.filter((e) => {
      console.log(e);
      console.log(Helper.isBeforeNow(e.eventDate));
      return Helper.isBeforeNow(e.eventDate);
    });

    const lastEventDate =
      pastEvents?.length > 0
        ? pastEvents[0].eventDate
        : this.friend.friendSince;
    console.log(lastEventDate);

    this.friend.connectionState = this.userService.getConnectionState(
      this.friend.intFreq,
      lastEventDate
    );
    this.friend.connectionStateEmogi = avatarState.get(
      this.friend.connectionState
    );

    this.goalInteraction =
      Helper.goalInteraction(this.friend.intFreq) ||
      "Every " + this.friend.intFreq + " days";

    if (this.friend.avatarUrl) {
      this.avatar$ = (
        await this.userService.getAvatar(this.friend.avatarUrl)
      ).pipe(
        catchError((err) => {
          return of(this.defaultAvatar);
        }),
        map((res) => {
          console.log(res);
          return res;
        })
      );
    } else {
      this.avatar$ = of(this.defaultAvatar);
    }

    this.loading = false;
    this.dataLoaded = true;
  }
}
