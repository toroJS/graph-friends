import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { PolarChartComponent } from "./polar-chart/polar-chart.component";
import { RadarChartComponent } from "./radar-chart/radar-chart.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [PolarChartComponent, RadarChartComponent],
  exports: [PolarChartComponent, RadarChartComponent],
  providers: [],
})
export class ChartsModule {}
