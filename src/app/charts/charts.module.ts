import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { PolarChartComponent } from "./polar-chart/polar-chart.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [PolarChartComponent],
  exports: [PolarChartComponent],
  providers: [],
})
export class ChartsModule {}
