import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
import { ProfileComponent } from "./profile/profile.component";
import { CreateEventModalComponent } from "./modals/create-event-modal/create-event-modal.component";
import { CreateConnectionModalComponent } from "./modals/create-connection-modal/create-connection-modal.component";
import { ComponentsModule } from "../components/components.module";

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
    path: "profile",
    component: ProfileComponent,
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
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DashboardPage,
    SingleConectionComponent,
    ActivityComponent,
    ProfileComponent,
    CreateEventModalComponent,
    CreateConnectionModalComponent,
  ],
  providers: [DashboardPageResolver],
})
export class PagesModule {}
