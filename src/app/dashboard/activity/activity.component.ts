import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { UserModel } from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  conections$ = this.userService.conections$;
  events$ = this.userService.createdEvents$;
  public user: UserModel;

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
        this.userService.getAllCreatedEvents(this.user.userId);
      });
  }

  getCreatedEvents() {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
