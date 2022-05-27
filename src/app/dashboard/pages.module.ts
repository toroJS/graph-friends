import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DashboardPage } from "./dashboard.page";
import { RouterModule, Routes } from "@angular/router";
import { DashboardPageResolver } from "./pages.resolver";

import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from "@angular/fire/auth-guard";
import { SingleConectionComponent } from "./single-connection/single-conection.component";
import { ChartsModule } from "../charts/charts.module";
import { ActivityComponent } from "./activity/activity.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["sign-in"]);

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardPage,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    resolve: {
      data: DashboardPageResolver,
    },
  },
  {
    path: "activity",
    component: ActivityComponent,
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    resolve: {
      data: DashboardPageResolver,
    },
  },
  {
    path: "connection/:connectionUserId",
    component: SingleConectionComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    resolve: {
      data: DashboardPageResolver,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DashboardPage, SingleConectionComponent, ActivityComponent],
  providers: [DashboardPageResolver],
})
export class PagesModule {}
