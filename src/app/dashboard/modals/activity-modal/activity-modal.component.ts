import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-activity-modal",
  templateUrl: "./activity-modal.component.html",
  styleUrls: ["./activity-modal.component.scss"],
})
export class ActivityModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}
  @Input() event: any;
  ngOnInit() {}

  public closeModal() {
    this.modalController.dismiss();
  }
}
