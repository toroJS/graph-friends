import { Injectable } from "@angular/core";
import * as moment from "moment";
import { BehaviorSubject, Subject } from "rxjs";
import { FirebaseAuthService } from "../firebase-auth.service";
import Helper from "../helpers/helpers";
import { DBEventModel, DBUserModel, UserModel } from "../models/types";
import { Neo4jAuraService } from "../neo4j-aura.service";
import { v4 as uuidv4 } from "uuid";
import { names } from "../helpers/mockData";
import { ProfileModel } from "../profile/profile.model";

@Injectable({ providedIn: "root" })
export class ActivityService {
  public user$ = new BehaviorSubject<UserModel>(null);
  public conections$ = new BehaviorSubject<UserModel[]>(null);
  public selectedConnectionId$ = new BehaviorSubject<string>(null);

  constructor(
    private authService: FirebaseAuthService,
    private db: Neo4jAuraService
  ) {}
}
