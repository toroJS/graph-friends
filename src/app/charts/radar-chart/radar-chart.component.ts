import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Chart } from "chart.js";
import { activityColors } from "../chartConfigs";

@Component({
  selector: "app-radar-chart",
  templateUrl: "./radar-chart.component.html",
  styleUrls: ["./radar-chart.component.scss"],
})
export class RadarChartComponent implements AfterViewInit {
  @ViewChild("chartCanvas") private chartCanvas: ElementRef;
  @Input() monthsEvents;
  barChart: any;
  labels: any;
  datasets: any;
  options = {
    responsive: false,
    legend: {
      display: false,
    },
    layout: {
      padding: 15,
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: true,
          },
          ticks: {
            display: true,
            fontSize: 12,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          gridLines: {
            display: true,
          },
          ticks: {
            display: true,
            fontSize: 12,
          },
        },
      ],
    },
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.monthsEvents.currentValue);
    const current = changes.monthsEvents.currentValue;
    if (current) {
      console.log();
      this.updateChart();
    }
  }

  getLabels() {
    const labels = [];
    for (const month of this.monthsEvents) {
      for (const event of month) {
        if (!labels.includes(event.eventType)) {
          labels.push(event.eventType);
        }
      }
    }
    this.labels = labels;
  }

  countEventsAndGetLabelColor(monthsEvents) {
    let data: any = {};
    data.count = [];
    data.labelColors = [];
    data.label = null;
    for (const label of this.labels) {
      let count = 0;
      for (const event of monthsEvents) {
        console.log(event);
        data.label = event.eventDate.format("MMM");
        if (label === event.eventType) {
          count++;
        }
      }
      data.count.push(count);
      data.labelColors.push(activityColors.get(label));
    }
    console.log(data);

    return data;
  }

  getDatasets() {
    this.datasets = [];
    for (const month of this.monthsEvents) {
      console.log(month);
      const data = this.countEventsAndGetLabelColor(month);
      const monthCount = data.count;
      const labelColors = data.labelColors;
      const label = data.label;
      const dataSet = {
        label: label,
        data: monthCount,
        backgroundColor: labelColors,
      };
      this.datasets.push(dataSet);
    }
  }

  ngAfterViewInit(): void {
    this.barChartBrowser();
  }

  removeNull() {
    this.monthsEvents = this.monthsEvents.filter((m) => m != null);
  }
  updateChart() {
    if (this.barChart) {
      console.log("update chart");

      this.removeNull();
      this.getLabels();
      this.getDatasets();

      this.barChart.data.datasets = this.datasets;
      this.barChart.data.labels = this.labels;
      this.barChart.update();
    }
  }
  barChartBrowser(): void {
    this.removeNull();
    this.getLabels();
    this.getDatasets();
    console.log(this.monthsEvents);
    console.log(this.labels);

    console.log(this.datasets);

    this.barChart = new Chart(this.chartCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
    });
  }
}
