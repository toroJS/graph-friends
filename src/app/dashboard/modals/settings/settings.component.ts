import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingController, ModalController } from "@ionic/angular";
import { FirebaseAuthService } from "src/app/firebase-auth.service";
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
    public userService: UserService,
    private router: Router,
    private authService: FirebaseAuthService
  ) {
    this.settingsForm = this.formBuilder.group({});
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
      return false;
    } else {
      this.loading = await this.loadingController.create({
        message: "Please wait...",
      });
      await this.loading.present();

      this.loading.dismiss();
      this.closeModal();
    }
  }

  signOut() {
    this.authService.signOut().subscribe(
      () => {
        this.router.navigate(["sign-in"]);
        this.closeModal();
      },
      (error) => {
        console.error("signout error", error);
      }
    );
  }
}
