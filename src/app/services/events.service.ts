import { Injectable } from "@angular/core";
import { Neo4jAuraService } from "../neo4j-aura.service";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: "root" })
export class EventsService {
  constructor(private db: Neo4jAuraService, private storage: StorageService) {}

  public async createEvent(userId, event, invited: string[], file) {
    await this.db.createEvent(userId, event);
    if (file) {
      const path = `events/${event.eventId + "/" + file.name}`;
      await this.storage.uploadFile(path, file);
    }

    invited?.forEach((friend) => {
      this.db.addAttendance(friend, event.eventId);
    });
  }
}
