import type { IDomainId } from "./IDomainId";

export interface ITrack extends IDomainId {
    id: string;
    title: string;
    filePath: string;
    coverPath: string;
    uploaded: string;
    duration: number;
    timesPlayed: number,
    timesSaved: number,
    artistInTracks: {
        id: string;
        trackId: string;
        userId: string;
        artistRoleId: string;
        artistDisplayName: string;
        artistRoleName: string;
    }[];
    rating: {
        id: string;
        trackId: string;
        userId: string;
        score: number;
        comment: string;
        artistDisplayName: string;
    }[];
    trackLinks: {
        id: string;
        trackId: string;
        linkTypeId: string;
        url: string;
        linkTypeName: string;
    }[];
    tagsInTracks: {
        id: string;
        trackId: string;
        tagId: string;
        tagName: string;
    }[];
    moodsInTracks: {
        id: string;
        trackId: string;
        moodId: string;
        moodName: string;
    }[];
}