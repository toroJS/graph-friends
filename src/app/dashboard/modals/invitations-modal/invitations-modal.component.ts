import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AttendanceStatus } from "src/app/models/types";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-activity-modal",
  templateUrl: "./invitations-modal.component.html",
  styleUrls: ["./invitations-modal.component.scss"],
})
export class InvitationsModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private userService: UserService
  ) {}
  @Input() event: any;
  @Input() userId: any;
  public AttendanceStatus = AttendanceStatus;
  ngOnInit() {}

  public closeModal() {
    this.modalController.dismiss();
  }

  public changeInvitationStatus(status: AttendanceStatus) {
    this.userService.changeInvitationStatus(
      this.userId,
      this.event.eventId,
      status
    );
    this.event.attendanceStatus = status;
    this.userService.getInvitations(this.userId);
  }
}
