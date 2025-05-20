import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";
import { IDomainId } from "@/types/domain/IDomainId";

export abstract class EntityService<TEntity extends IDomainId> extends BaseService {
	constructor(private basePath: string) {
		super();
	}

	async getAllAsync(): Promise<IResultObject<TEntity[]>> {
		try {

			const response = await this.axiosInstance.get<TEntity[]>(this.basePath)

			console.log('getAll response', response)

			if (response.status <= 300) {
				return {
					data: response.data
				}
			}

			return {
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async getAsync(id: string): Promise<IResultObject<TEntity>> {
		try {

			const response = await this.axiosInstance.get<TEntity>(this.basePath + "/" + id)

			console.log('get response', response)

			if (response.status <= 300) {
				return {
					data: response.data
				}
			}

			return {
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async deleteAsync(id: string): Promise<IResultObject<null>> {
		try {

			const response = await this.axiosInstance.delete<null>(this.basePath + "/" + id)

			console.log('get response', response)

			if (response.status <= 300) {
				return {
					data: null
				}
			}

			return {
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}


	async addAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.post<TEntity>(this.basePath, entity)

			console.log('add response', response)

			if (response.status <= 300) {
				return {
					data: response.data
				}
			}

			return {
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}


	async updateAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.put<TEntity>(this.basePath + "/" + entity.id, entity)

			console.log('login response', response)

			if (response.status <= 300) {
				return {
					data: response.data
				}
			}

			return {
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}



}
