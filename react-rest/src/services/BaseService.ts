import { AccountContext } from "@/context/AccountContext";
import { ILoginDto } from "@/types/ILoginDto";
import axios, { AxiosInstance } from "axios";
import { useContext } from "react";

export abstract class BaseService {
	protected axiosInstance: AxiosInstance;

	private setAccountInfo = useContext(AccountContext).setAccountInfo;


	constructor() {
		this.axiosInstance
			= axios.create({
				baseURL: "http://localhost:8888/api/v1.0/",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});


		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("_jwt");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.axiosInstance.interceptors.response.use(
			(response) => {
				return response;
			},

			async (error) => {
				const oringinalRequest = error.config;

			if (error.response && error.response.status === 401 && !oringinalRequest._retry) {
			oringinalRequest._retry = true;

			const jwt = localStorage.getItem("_jwt");
			const refreshToken = localStorage.getItem("_refreshToken");

			if (!jwt || !refreshToken) {
				console.warn("No JWT or refreshToken in localStorage, cannot refresh.");
				return Promise.reject(error);
			}

			try {
				const response = await axios.post<ILoginDto>(
				"http://localhost:8888/api/v1.0/Account/TokenRefresh",
				{ jwt, refreshToken }
				);

				if (response.status <= 300) {
				localStorage.setItem("_jwt", response.data.jwt);
				localStorage.setItem("_refreshToken", response.data.refreshToken);
				oringinalRequest.headers.Authorization = `Bearer ${response.data.jwt}`;

				this.setAccountInfo?.({
					jwt: response.data.jwt,
					refreshToken: response.data.refreshToken,
				});

				return this.axiosInstance(oringinalRequest);
				}

				return Promise.reject(error);
			} catch (error) {
				console.error("Error refreshing token:", error);
				return Promise.reject(error);
			}
			}

				return Promise.reject(error);
			}
		);
	}
}

