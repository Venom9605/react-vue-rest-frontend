import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from './BaseService'
import { useUserDataStore } from '@/stores/userDataStore';

export abstract class BaseEntityService<TEntity> extends BaseService {
    private store = useUserDataStore();

    constructor(private baseUrl: string) {
        super()
    }

    async getAllAsync(jwt: string): Promise<IResultObject<TEntity[]>> {
        const url = this.baseUrl;

        try {
        const response = await BaseService.axios.get<TEntity[]>(
            url,
            {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              }
        )

        console.log('getAll response', response)

        if (response.status <= 300) {
            return { data: response.data }
        }

        return {
            errors: [(response.status.toString() + ' ' + response.statusText).trim()],
        }
        } catch (error) {
        console.log('error: ', (error as Error).message)
        return {
            errors: [JSON.stringify(error)],
        }
        }
    }

    async addAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
        try {
          let options = {}
          if (this.store.jwt) {
            options = {
              headers: {
                Authorization: `Bearer ${this.store.jwt}`,
              },
            }
          }
          console.log('POST Request Payload:', entity);
          console.log('POST Request Options:', options);

          const response = await BaseService.axios.post<TEntity>(this.baseUrl, entity, options)
    
          console.log('login response', response)
    
          if (response.status <= 300) {
            return { data: response.data }
          }
    
          return {
            errors: [(response.status.toString() + ' ' + response.statusText).trim()],
          }
        } catch (error) {
          console.log('error: ', (error as Error).message)
          return {
            errors: [JSON.stringify(error)],
          }
        }
      }

      async findAsync(id: string): Promise<IResultObject<TEntity>> {
        try {
          const url = `${this.baseUrl}/${id}`;
          const options = this.store.jwt
            ? {
                headers: {
                  Authorization: `Bearer ${this.store.jwt}`,
                },
              }
            : {};
      
          const response = await BaseService.axios.get<TEntity>(url, options);
      
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

      async updateAsync(id: string, entity: TEntity): Promise<IResultObject<void>> {
        try {
          const url = `${this.baseUrl}/${id}`;
          const options = this.store.jwt
            ? {
                headers: {
                  Authorization: `Bearer ${this.store.jwt}`,
                },
              }
            : {};
      
          const response = await BaseService.axios.put<void>(url, entity, options);
      
          if (response.status <= 300) {
            return { data: undefined };
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

      async deleteAsync(id: string): Promise<IResultObject<void>> {
        try {
          const url = `${this.baseUrl}/${id}`;
          const options = this.store.jwt
            ? {
                headers: {
                  Authorization: `Bearer ${this.store.jwt}`,
                },
              }
            : {};
      
          const response = await BaseService.axios.delete<void>(url, options);
      
          if (response.status <= 300) {
            return { data: undefined };
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
