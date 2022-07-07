import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController, ModalController } from "@ionic/angular";
import { UserModel } from "src/app/models/types";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  @Input() user: UserModel;

  public settingsForm: FormGroup;

  avatarUrl: any;
  file: any;
  isSubmitted = false;
  loading: HTMLIonLoadingElement;
  eventTypes = ["sport", "eating"];
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public userService: UserService //private db: Neo4jAuraService, //private storage: StorageService, //private eventsService: EventsService,
  ) {
    this.settingsForm = this.formBuilder.group({
      // eventName: ["", [Validators.required, Validators.minLength(2)]],
      // eventType: ["", [Validators.required]],
      // email: [
      //   "",
      //   [
      //     Validators.required,
      //     Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      //   ],
      // ],
      // eventDate: [this.defaultDate],
      // invitedFriends: [],
      // eventDescription: [],
      // mobile: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
    });
  }

  async ngOnInit() {
    if (this.user.avatarUrl) {
      this.avatarUrl = await this.userService.getAvatar(this.user.avatarUrl);
    }
  }

  public onEmitFile(file) {
    this.file = file;
    this.userService.saveAvatar(this.user.userId, this.file);
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  async saveSettings() {
    this.isSubmitted = true;
    if (!this.settingsForm.valid) {
      console.log("Please provide all the required values!");
      return false;
    } else {
      this.loading = await this.loadingController.create({
        message: "Please wait...",
      });
      await this.loading.present();
      // const {
      //   eventDate,
      //   eventDescription,
      //   eventName,
      //   eventType,
      //   invitedFriends,
      // } = this.settingsForm.value;

      // const newEvent = {
      //   eventId: generatedId,
      //   eventType: eventType,
      //   eventDate: eventDate,
      //   eventName: eventName,
      //   eventImageSrc: this.file?.name
      //     ? `events/${generatedId + "/" + this.file.name}`
      //     : "",
      //   eventDescription: eventDescription,
      // };

      this.loading.dismiss();
      this.closeModal();
    }
  }
}
