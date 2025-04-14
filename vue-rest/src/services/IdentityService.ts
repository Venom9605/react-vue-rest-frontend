import type { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import type { LoginDto } from "@/types/LoginDto";
import type { RegisterDto } from "@/types/RegisterDto";
import type { LogoutDto } from "@/types/LogoutDto";
import type { RefreshDto } from "@/types/RefreshDto";

export abstract class IdentityService extends BaseService {

    static async login(email: string, password: string): Promise<IResultObject<LoginDto>> {
        const url = 'account/login'
        try {
            const loginData = {
                email,
                password
            }
            const response = await this.axios.post<LoginDto>(url, loginData)

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

    static async register(
      email: string, 
      password: string, 
      displayName: string, 
      profilePicture: string, 
      bio: string): 
      Promise<IResultObject<RegisterDto>> {

      const url = 'account/register'
      try {
          const RegisterData = {
              email,
              password,
              displayName,
              profilePicture,
              bio
          }
          const response = await this.axios.post<RegisterDto>(url, RegisterData)

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

    static async logout(jwt: string, refreshToken: string): Promise<IResultObject<LogoutDto>> {
      const url = 'account/logout'

      try {
          const logoutData = {
              refreshToken
          }
          const response = await this.axios.post<LogoutDto>(
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

    static async tokenRefresh(jwt: string, refreshToken: string): Promise<IResultObject<RefreshDto>> {
      const url = 'account/tokenrefresh'
    
      try {
        const requestData = {
          jwt,
          refreshToken
        }
    
        const response = await this.axios.post<RefreshDto>(url, requestData)
    
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