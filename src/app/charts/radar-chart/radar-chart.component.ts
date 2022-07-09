import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Chart, ChartOptions } from "chart.js";
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
  labelColors: string[] = ["red", "blue"];
  datasets: any;
  options: ChartOptions<any> = {
    indexAxis: "y",

    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,

    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#f0cea0",
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "#f0cea0", beginAtZero: true },
      },
      x: {
        ticks: { color: "#f0cea0", beginAtZero: true },
      },
    },
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const current = changes.monthsEvents.currentValue;
    if (current) {
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
    data.labelColors = ["#b3d4ff", "#00bfa0"];
    data.label = null;
    for (const label of this.labels) {
      let count = 0;
      for (const event of monthsEvents) {
        data.label = event.eventDate.format("MMM");
        if (label === event.eventType) {
          count++;
        }
      }
      data.count.push(count);
      //data.labelColors.push(activityColors.get(label));
    }

    return data;
  }

  getDatasets() {
    this.datasets = [];
    for (const [i, month] of this.monthsEvents.entries()) {
      console.log(month, i);

      const data = this.countEventsAndGetLabelColor(month);
      const monthCount = data.count;
      const labelColors = data.labelColors;
      const label = data.label;
      const dataSet = {
        label: label,
        data: monthCount,
        backgroundColor: labelColors[i],
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

    this.barChart = new Chart(this.chartCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: this.options,
    });
  }
}
