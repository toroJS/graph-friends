import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";

import { UserModel } from "src/app/models/types";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-create-conection-modal",
  templateUrl: "./create-connection-modal.component.html",
  styleUrls: ["./create-connection-modal.component.scss"],
})
export class CreateConnectionModalComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  @Input() friends$;
  private friends;
  private friendsSubscription;
  public friendForm: FormGroup;
  defaultDate = new Date().toISOString();
  isSubmitted = false;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private db: Neo4jAuraService
  ) {
    // componentProps can also be accessed at construction time using NavParams

    this.friendForm = this.formBuilder.group({
      userName: ["", [Validators.required, Validators.minLength(2)]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ],
      ],
      intFreq: ["", [Validators.required]],
      //mobile: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
    });
  }

  ngOnInit(): void {
    this.friendsSubscription = this.friends$.subscribe((friends) => {
      this.friends = friends;
    });
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.friendForm.get("eventDate").setValue(date, {
      onlyself: true,
    });
  }

  get errorControl() {
    return this.friendForm.controls;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  public async addFriend() {
    this.isSubmitted = true;
    if (!this.friendForm.valid) {
      console.log("Please provide all the required values!");
      return false;
    } else {
      console.log(this.friendForm.value);
      const { userName, email, intFreq } = this.friendForm.value;
      console.log(this.friends.includes(email));
      if (!this.friends.includes(email)) {
        const newFriend = await this.db.getUserByEmail(email);
        if (newFriend) {
          console.log("only befriend");
          this.db.addConection(this.userId, newFriend.userId, intFreq);
        } else {
          //not sure if only allow the creation of users that are in the platform?
          console.log("create and befriend");
          const newUserId = uuidv4();
          const createFriend: UserModel = {
            userId: newUserId,
            userName: userName,
            email: email,
            createdAt: new Date().toDateString(),
            avatarUrl: "",
          };
          await this.db.createUser(createFriend);
          this.db.addConection(this.userId, newUserId, intFreq);
        }
      } else {
        console.log("already a friend");
      }
      console.log(this.friends);
    }
  }

  ngOnDestroy(): void {
    this.friendsSubscription.unsubscribe();
  }
}
