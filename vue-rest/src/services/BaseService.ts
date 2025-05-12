import axios from "axios";
import { useUserDataStore } from "@/stores/userDataStore";
import { IdentityService } from "@/services/IdentityService";

export abstract class BaseService {
    protected static axios = axios.create({
        baseURL: "http://localhost:5081/api/v1.0/",
        headers: {
            common: {
                Accept: "application/json",

            }
        }
    });

    static setupInterceptor() {
        this.axios.interceptors.response.use(
          response => response,
          async error => {
            const originalRequest = error.config;
            const store = useUserDataStore();
    
            if (error.response?.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
    
              const refreshResponse = await IdentityService.tokenRefresh(store.jwt, store.refreshToken);
    
              if (refreshResponse.data) {
                store.jwt = refreshResponse.data.jwt;
                store.refreshToken = refreshResponse.data.refreshToken;
    
                // update Authorization header and retry original request
                originalRequest.headers['Authorization'] = `Bearer ${store.jwt}`;
                return this.axios(originalRequest);
              } else {
                console.log("REFRESH FAILED!!!!")
                // refresh failed — force logout or redirect
                store.jwt = "";
                store.refreshToken = "";
              }
            }
    
            return Promise.reject(error);
          }
        );
      }
}