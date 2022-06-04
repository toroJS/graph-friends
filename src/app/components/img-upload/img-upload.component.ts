import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-img-upload",
  templateUrl: "./img-upload.component.html",
  styleUrls: ["./img-upload.component.scss"],
})
export class ImgUploadComponent {
  file: any;
  constructor(public fb: FormBuilder, private cd: ChangeDetectorRef) {}

  /*##################### Registration Form #####################*/
  // public registrationForm = this.fb.group({
  //   file: [null],
  // });

  /*########################## File Upload ########################*/
  @ViewChild("fileInput") el: ElementRef;
  imageUrl: any = "https://i.ibb.co/fDWsn3G/buck.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = async () => {
        this.imageUrl = reader.result;
        // this.registrationForm.patchValue({
        //   file: reader.result,
        // });
        this.file = reader.result;
        this.editFile = false;
        this.removeUpload = true;

        console.log(this.file);
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
    event.target.value = "";
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl =
      "https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg";
    this.editFile = true;
    this.removeUpload = false;
    this.imageUrl = null;
  }
}
