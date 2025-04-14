import type { ITrack } from "@/domain/ITracks";
import { BaseEntityService } from "./BaseEntityService";

export class TrackService extends BaseEntityService<ITrack> {
    constructor() {
        super("track/getTracks");
    }
}