import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { ImgUploadComponent } from "./img-upload/img-upload.component";
import { FriendCardComponent } from "./friend-card/friend-card.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [ImgUploadComponent, FriendCardComponent],
  exports: [ImgUploadComponent, FriendCardComponent],
  providers: [],
})
export class ComponentsModule {}
