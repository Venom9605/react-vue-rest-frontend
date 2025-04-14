import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from './BaseService'

export abstract class BaseEntityService<TEntity> extends BaseService {

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
}
