export interface TrackCreateDto {
  title: string;
  filePath: string;
  coverPath: string;
  artistRoleId: string;
  collaborators: {
    email: string;
    artistRoleId: string;
  }[];
  tagsInTracks: {
    tagId: string;
  }[];
  moodsInTracks: {
    moodId: string;
  }[];
  trackLinks: {
    linkTypeId: string;
    url: string;
  }[];
}
