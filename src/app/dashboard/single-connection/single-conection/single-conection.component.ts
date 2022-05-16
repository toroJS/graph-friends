import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FirebaseAuthService } from "../../../firebase-auth.service";
import { Neo4jAuraService } from "../../../neo4j-aura.service";
import { UserService } from "../../../services/user.service";
import { EMPTY, iif, Observable, of, Subject } from "rxjs";
import {
  filter,
  mergeMap,
  skip,
  skipUntil,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";
import { UserModel } from "../../../models/types";
import { Location } from "@angular/common";

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
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
            }
          });
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
