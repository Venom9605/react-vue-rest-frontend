import type { IDomainId } from "./IDomainId";

export interface ITrack extends IDomainId {
    title: string;
    filePath: string;
    coverPath: string;
    uploaded: string;
    duration: number;
    timesPlayed: number,
    timesSaved: number,
}