import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-img-upload",
  templateUrl: "./img-upload.component.html",
  styleUrls: ["./img-upload.component.scss"],
})
export class ImgUploadComponent {
  file: any;
  @Output() outputFile = new EventEmitter<string>();
  constructor(private cd: ChangeDetectorRef, private storage: StorageService) {}
  @ViewChild("fileInput") el: ElementRef;
  @Input() imageUrl: any = "";
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.outputFile.emit(file);
    //this.storage.uploadFile(file);

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
