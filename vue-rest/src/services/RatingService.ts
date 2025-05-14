import type { RatingCreateDto } from '@/types/RatingCreateDto';
import type { IResultObject } from '@/types/IResultObject';
import { BaseService } from './BaseService';
import { useUserDataStore } from '@/stores/userDataStore';

export class RatingService extends BaseService {
  static async create(dto: RatingCreateDto): Promise<IResultObject<void>> {
    const store = useUserDataStore();
    try {
      const response = await this.axios.post<void>(
        'Rating/Create',
        dto,
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`
          }
        }
      );

      if (response.status <= 300) return { data: undefined };
      return { errors: [(response.status + ' ' + response.statusText).trim()] };

    } catch (err) {
      return { errors: [JSON.stringify(err)] };
    }
  }
}
