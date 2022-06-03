import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, of, Subject } from "rxjs";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";
import { UserModel } from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { UserService } from "src/app/services/user.service";
import * as moment from "moment";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;
  events$ = this.userService.createdEvents$;
  // eventsFilter$ = this.userService.createdEvents$.pipe(
  //   map((e: any) => {
  //     e?.forEach((element) => {
  //       console.log(this.selectedMonth);

  //       console.log(element.eventDate);
  //       console.log(element.eventDate.isSame(element.eventDate, "month"));
  //     });
  //   })
  // );
  selectedfirstMonth$ = new BehaviorSubject(null);
  selectedsecondMonth$ = new BehaviorSubject(null);
  filterFirstMonth$ = this.selectedfirstMonth$.pipe(
    filter((e) => e !== null),
    switchMap((e) => {
      return this.events$.pipe(
        map((events) => {
          const filter = events.filter((event) => {
            return event.eventDate.isSame(moment(e), "month");
          });
          return filter;
        })
      );
    })
  );
  filterSecondMonth$ = this.selectedsecondMonth$.pipe(
    filter((e) => e !== null),
    switchMap((e) => {
      return this.events$.pipe(
        map((events) => {
          const filter = events.filter((event) => {
            return event.eventDate.isSame(moment(e), "month");
          });
          return filter;
        })
      );
    })
  );
  public user: UserModel;
  public selectedFirstMonth: any;
  public selectedSecondMonth: any;
  constructor(
    private userService: UserService,
    private neo: Neo4jAuraService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(filter((user) => user !== null))
      .subscribe(async (user) => {
        console.log(user);
        this.user = user;
        this.userService.getAllCreatedEvents(this.user.userId).then(() => {
          if (!this.selectedFirstMonth || !this.selectedSecondMonth) {
            const currentMonth = moment().toDate().toISOString();
            const lastMonth = moment()
              .subtract(1, "months")
              .toDate()
              .toISOString();
            console.log(currentMonth);
            console.log(lastMonth);
            this.selectedFirstMonth = currentMonth;
            this.selectedSecondMonth = lastMonth;

            this.selectedfirstMonth$.next(currentMonth);
            this.selectedsecondMonth$.next(lastMonth);
          }
        });
      });
  }

  public onDateSelected() {
    console.log(this.selectedFirstMonth);

    this.selectedfirstMonth$.next(this.selectedFirstMonth);
  }

  public onSecondDateSelected() {
    this.selectedsecondMonth$.next(this.selectedSecondMonth);
  }
  getCreatedEvents() {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
