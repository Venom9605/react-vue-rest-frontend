import type { ITrack } from "@/domain/ITracks";
import { BaseEntityService } from "./BaseEntityService";
import type { TrackCreateDto } from "@/types/TrackCreateDto";
import type { TrackUpdateDto } from "@/types/TrackUpdateDto";
import { BaseService } from "./BaseService";
import type { IResultObject } from "@/types/IResultObject";
import { useUserDataStore } from "@/stores/userDataStore";

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

export class TrackGetRandomService extends BaseService {
    async getRandomTrack(jwt: string): Promise<IResultObject<ITrack>> {
        try {
            const response = await BaseService.axios.get<ITrack>(
                "track/getRandomTrack",
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );

            if (response.status <= 300) {
                return { data: response.data };
            }

            return {
                errors: [(response.status.toString() + ' ' + response.statusText).trim()],
            };

        } catch (error) {
            return {
                errors: [JSON.stringify(error)],
            };
        }
    }
}


export class TrackSaveService extends BaseService {
  static async saveTrack(trackId: string): Promise<IResultObject<void>> {
    const store = useUserDataStore();

    try {
      const response = await this.axios.post<void>(
        'UserSavedTracks/AddSavedTrack',
        { trackId },
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`,
          }
        }
      );

      if (response.status <= 300) {
        return { data: undefined };
      }

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      };
    } catch (err) {
      return {
        errors: [JSON.stringify(err)],
      };
    }
  }

    static async removeSavedTrack(trackId: string): Promise<IResultObject<void>> {
    const store = useUserDataStore();

    try {
      const response = await this.axios.delete<void>(
        `UserSavedTracks/RemoveByTrackId/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`,
          }
        }
      );

      if (response.status <= 300) return { data: undefined };

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      };
    } catch (err) {
      return {
        errors: [JSON.stringify(err)],
      };
    }
  }

    static async getSavedTracks(): Promise<IResultObject<ITrack[]>> {
    const store = useUserDataStore();

    try {
      const response = await this.axios.get<ITrack[]>(
        "UserSavedTracks/GetSavedTracks",
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`,
          }
        }
      );

      if (response.status <= 300) {
        return { data: response.data };
      }

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      };
    } catch (err) {
      return {
        errors: [JSON.stringify(err)],
      };
    }
  }
}

export class TrackUploadService extends BaseService {
    static async uploadCover(file: File): Promise<IResultObject<{ path: string }>> {
      const store = useUserDataStore();
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await this.axios.post<{ path: string }>(
          'Track/UploadCover',
          formData,
          {
            headers: {
              Authorization: `Bearer ${store.jwt}`,
            }
          }
        );
  
        if (response.status <= 300) {
          return { data: response.data };
        }
  
        return {
          errors: [(response.status.toString() + ' ' + response.statusText).trim()],
        };
      } catch (err) {
        return {
          errors: [JSON.stringify(err)],
        };
      }
    }


    static async uploadAudio(file: File): Promise<IResultObject<{ path: string }>> {
        const store = useUserDataStore();
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await this.axios.post<{ path: string }>(
            'track/UploadTrackFile',
            formData,
            {
              headers: {
                Authorization: `Bearer ${store.jwt}`
              }
            }
          );
    
          if (response.status <= 300) return { data: response.data };
    
          return {
            errors: [(response.status.toString() + ' ' + response.statusText).trim()],
          };
        } catch (err) {
          return {
            errors: [JSON.stringify(err)],
          };
        }
      }
  }


  