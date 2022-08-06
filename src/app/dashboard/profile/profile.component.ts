import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, switchMap, isEmpty } from "rxjs/operators";
import { UserModel } from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { UserService } from "src/app/services/user.service";
import * as moment from "moment";
import { ModalController } from "@ionic/angular";
import { SettingsComponent } from "../modals/settings/settings.component";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;
  events$ = this.userService.createdEvents$;

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
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(filter((user) => user !== null))
      .subscribe(async (user) => {
        this.user = user;
        if (this.events$.pipe(isEmpty())) {
          this.userService
            .getAllCreatedEvents(this.user.userId)
            .then(() => this.selectMonths());
        } else {
          this.selectMonths();
        }
      });
  }

  private selectMonths() {
    if (!this.selectedFirstMonth || !this.selectedSecondMonth) {
      const currentMonth = moment().toDate().toISOString();
      const lastMonth = moment().subtract(1, "months").toDate().toISOString();

      this.selectedFirstMonth = currentMonth;
      this.selectedSecondMonth = lastMonth;

      this.selectedfirstMonth$.next(currentMonth);
      this.selectedsecondMonth$.next(lastMonth);
    }
  }

  public onDateSelected() {
    this.selectedfirstMonth$.next(this.selectedFirstMonth);
  }

  public onSecondDateSelected() {
    this.selectedsecondMonth$.next(this.selectedSecondMonth);
  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      componentProps: {
        user: this.user,
      },
    });

    await modal.present();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
