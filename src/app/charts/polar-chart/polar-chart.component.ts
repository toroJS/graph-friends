import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import Chart from "chart.js/auto";
@Component({
  selector: "app-polar-chart",
  templateUrl: "./polar-chart.component.html",
  styleUrls: ["./polar-chart.component.scss"],
})
export class PolarChartComponent implements AfterViewInit {
  @ViewChild("pieCanvas") private pieCanvas: ElementRef;
  @Input() events;
  pieChart: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.pieChartBrowser();
  }

  pieChartBrowser(): void {
    const labels = [];
    const data = [];
    for (const event of this.events) {
      if (!labels.includes(event.eventType)) {
        labels.push(event.eventType);
      }
    }
    for (const label of labels) {
      let count = 0;
      for (const event of this.events) {
        if (label === event.eventType) {
          count++;
        }
      }
      data.push(count);
    }

    if (labels.length < 1) labels.push("No Data");
    if (data.length < 1) data.push(1);

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: ["#2ecc71", "yellow", "#3498db"],
            data: data,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "#f0cea0",
            },
          },
        },
      },
    });
  }
}
