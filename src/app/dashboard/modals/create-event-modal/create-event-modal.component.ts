import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Neo4jAuraService } from "src/app/neo4j-aura.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-create-event-modal",
  templateUrl: "./create-event-modal.component.html",
  styleUrls: ["./create-event-modal.component.scss"],
})
export class CreateEventModalComponent {
  @Input() userId: string;
  @Input() friends$: any;
  public createEventForm: FormGroup;

  defaultDate = new Date().toISOString();
  isSubmitted = false;
  eventTypes = ["sport", "eating"];
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private db: Neo4jAuraService
  ) {
    // componentProps can also be accessed at construction time using NavParams

    this.createEventForm = this.formBuilder.group({
      eventName: ["", [Validators.required, Validators.minLength(2)]],
      eventType: ["", [Validators.required]],
      // email: [
      //   "",
      //   [
      //     Validators.required,
      //     Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      //   ],
      // ],
      eventDate: [this.defaultDate],
      invitedFriends: [],
      eventDescription: [],
      // mobile: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
    });
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.createEventForm.get("eventDate").setValue(date, {
      onlyself: true,
    });
  }

  get errorControl() {
    return this.createEventForm.controls;
  }

  // Sending data from Ionic modal to page
  settingIonic(version: string) {
    this.modalController.dismiss({ ionic: version }, "confirm");
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  settingJavascript() {}

  settingCommon(name: string) {
    this.modalController.dismiss({ name }, "confirm");
  }

  async createEvent() {
    this.isSubmitted = true;
    if (!this.createEventForm.valid) {
      console.log("Please provide all the required values!");
      return false;
    } else {
      const {
        eventDate,
        eventDescription,
        eventName,
        eventType,
        invitedFriends,
      } = this.createEventForm.value;
      const newEvent = {
        eventId: uuidv4(),
        eventType: eventType,
        eventDate: eventDate,
        eventName: eventName,
        eventDescription: eventDescription,
      };
      const eventId = await this.db.createEvent(this.userId, newEvent);
      // this.db.addAttendance(invitedFriends, eventId);
      invitedFriends.forEach((friend) => {
        this.db.addAttendance(friend, eventId);
      });
      console.log(eventId);
    }
  }
}
