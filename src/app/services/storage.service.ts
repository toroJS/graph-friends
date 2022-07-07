import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { EMPTY, of } from "rxjs";
@Injectable({ providedIn: "root" })
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  public async uploadFile(path: string, file) {
    this.storage.upload(path, file);
  }

  public async getImage(path: string) {
    try {
      this.storage.schedulers.ngZone.onError.subscribe((err) => {
        return of(EMPTY);
      });
      return await this.storage.ref(path).getDownloadURL();
    } catch (error) {
      console.log(error);
    }
  }
}
