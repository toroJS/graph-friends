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
import { SettingsComponent } from "./modals/settings/settings.component";
import { ActivityModalComponent } from "./modals/activity-modal/activity-modal.component";
import { InvitationsComponent } from "./invitations/invitations.component";
import { InvitationsModalComponent } from "./modals/invitations-modal/invitations-modal.component";
import { EventsComponent } from "./events/events.component";

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
    path: "events",
    component: EventsComponent,
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
    EventsComponent,
    ProfileComponent,
    CreateEventModalComponent,
    CreateConnectionModalComponent,
    SettingsComponent,
    ActivityModalComponent,
    InvitationsComponent,
    InvitationsModalComponent,
  ],
  providers: [DashboardPageResolver],
})
export class PagesModule {}
