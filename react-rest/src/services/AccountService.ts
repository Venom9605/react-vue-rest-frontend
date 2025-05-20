import { ILoginDto } from "@/types/ILoginDto"
import { BaseService } from "./BaseService"
import { IResultObject } from "@/types/IResultObject"
import { ILogoutDto } from "@/types/ILogOutDto"
import { IRegisterDto } from "@/types/IRegisterDto"
import { IRefreshDto } from "@/types/IRefreshDto"


export class AccountService extends BaseService {

    async login(email: string, password: string): Promise<IResultObject<ILoginDto>> {
        const url = 'account/login'
        try {
            const loginData = {
                email,
                password
            }

            const response = await this.axiosInstance.post<ILoginDto>(url, loginData)

            console.log("login response", response)

            if (response.status <= 300) {
                return { data: response.data }
            }

            return {
                errors: [(response.status.toString() + ' ' + response.statusText).trim()]
            }

        }
        catch (error: any) {
            if (error.response) {
              const status = error.response.status;
              const errorMsg = error.response.data?.error || error.response.data || "Unknown error";

              return {
                errors: [`${status} - ${errorMsg}`],
              }
            }

            return {
              errors: [error.message],
            }
          }


    }

    async register(
      email: string,
      password: string,
      displayName: string,
      profilePicture: string,
      bio: string):
      Promise<IResultObject<IRegisterDto>> {

      const url = 'account/register'
      try {
          const RegisterData = {
              email,
              password,
              displayName,
              profilePicture,
              bio
          }
          const response = await this.axiosInstance.post<IRegisterDto>(url, RegisterData)

          console.log("register response", response)

          if (response.status <= 300) {
              return { data: response.data }
          }

          return {
              errors: [(response.status.toString() + ' ' + response.statusText).trim()]
          }

      }
      catch (error: any) {
          if (error.response) {
            const status = error.response.status;
            const errorMsg = error.response.data?.error || error.response.data || "Unknown error";

            return {
              errors: [`${status} - ${errorMsg}`],
            }
          }

          return {
            errors: [error.message],
          }
        }
    }

    async logout(jwt: string, refreshToken: string): Promise<IResultObject<ILogoutDto>> {
      const url = 'account/logout'

      try {
          const logoutData = {
              refreshToken
          }
          const response = await this.axiosInstance.post<ILogoutDto>(
            url,
            logoutData,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )

          console.log("logout response", response)

          if (response.status <= 300) {
              return { data: response.data }
          }

          return {
              errors: [(response.status.toString() + ' ' + response.statusText).trim()]
          }

      }
      catch (error: any) {
          if (error.response) {
            const status = error.response.status;
            const errorMsg = error.response.data?.error || error.response.data || "Unknown error";

            return {
              errors: [`${status} - ${errorMsg}`],
            }
          }

          return {
            errors: [error.message],
          }
        }
    }

    async tokenRefresh(jwt: string, refreshToken: string): Promise<IResultObject<IRefreshDto>> {
      const url = 'account/tokenrefresh'

      try {
        const requestData = {
          jwt,
          refreshToken
        }

        const response = await this.axiosInstance.post<IRefreshDto>(url, requestData)

        if (response.status <= 300) {
          return { data: response.data }
        }

        return {
          errors: [(response.status.toString() + ' ' + response.statusText).trim()]
        }

      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          const errorMsg = error.response.data?.error || error.response.data || "Unknown error";

          return {
            errors: [`${status} - ${errorMsg}`],
          }
        }

        return {
          errors: [error.message],
        }
      }
    }
}
