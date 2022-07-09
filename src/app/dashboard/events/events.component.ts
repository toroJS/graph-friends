import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
})
export class EventsComponent implements OnInit {
  selectedTab = "host";
  constructor() {}

  ngOnInit() {}

  segmentChanged(ev: any) {
    this.selectedTab = ev.target.value;
  }
}
