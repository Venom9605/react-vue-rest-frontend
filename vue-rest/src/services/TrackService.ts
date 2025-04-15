import type { ITrack } from "@/domain/ITracks";
import { BaseEntityService } from "./BaseEntityService";
import type { TrackCreateDto } from "@/types/TrackCreateDto";
import type { TrackUpdateDto } from "@/types/TrackUpdateDto";

export class TrackGetAllService extends BaseEntityService<ITrack> {
    constructor() {
        super("track/getTracks");
    }
}

export class TrackGetService extends BaseEntityService<ITrack> {
    constructor() {
        super("track/getTrack");
    }
}

export class TrackCreateService extends BaseEntityService<TrackCreateDto> {
    constructor() {
        super("track/createTrack");
    }
}

export class TrackUpdateService extends BaseEntityService<TrackUpdateDto> {
    constructor() {
        super("track/updateTrack");
    }
}

export class TrackDeleteService extends BaseEntityService<ITrack> {
    constructor() {
        super("track/deleteTrack");
    }
}