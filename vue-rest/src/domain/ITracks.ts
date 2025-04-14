import type { IDomainId } from "./IDomainId";

export interface ITrack extends IDomainId {
    title: string;
    filepath: string;
    coverpath: string;
    uploaded: string;
    duration: number;
    timesPlayed: number,
    timesSaved: number,
}