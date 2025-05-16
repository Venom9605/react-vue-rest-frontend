import type { ITrack } from "@/domain/ITracks";
import type { IArtist } from "@/domain/IArtist";
import type { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { useUserDataStore } from "@/stores/userDataStore";

interface ISearchResultsDto {
  tracks: ITrack[];
  artists: IArtist[];
}

export class SearchService extends BaseService {
  static async searchAll(query: string): Promise<IResultObject<ISearchResultsDto>> {
    const store = useUserDataStore();

    try {
      const response = await this.axios.get<ISearchResultsDto>(
        `search/SearchAll/${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`
          }
        }
      );

      if (response.status <= 300) {
        return { data: response.data };
      }

      return {
        errors: [(response.status.toString() + " " + response.statusText).trim()]
      };
    } catch (error) {
      return {
        errors: [JSON.stringify(error)]
      };
    }
  }
}
