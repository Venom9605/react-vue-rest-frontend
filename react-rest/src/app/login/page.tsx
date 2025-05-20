"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { set, SubmitHandler, useForm } from "react-hook-form";

export default function Login() {

	const accountService = new AccountService();
	const {setAccountInfo} = useContext(AccountContext);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	type Inputs = {
		email: string;
		password: string;
	}

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Inputs>({
		defaultValues: {
			email: "test@test",
			password: "Test-123"
		}
	});

	const onSubmit : SubmitHandler<Inputs> = async (data: Inputs) => {
		setErrorMessage("Loading...");

		try {
			var result = await accountService.login(data.email, data.password);

			if (result.errors) {
				setErrorMessage(result.errors[0]);
				return;
			}

			setErrorMessage("");

			setAccountInfo!({
				jwt: result.data!.jwt,
				refreshToken: result.data!.refreshToken
			});

			localStorage.setItem("_jwt", result.data!.jwt);
			localStorage.setItem("_refreshToken", result.data!.refreshToken);

			router.push("/");


		} catch (error) {
			setErrorMessage("Login failed - " + (error as Error).message);
		}

	};

	return (
		<>
		<div className="row">
			<div className="col-4"></div>
			<div className="col-4">

			{errorMessage}

			<form onSubmit={handleSubmit(onSubmit)}>
                <h2>Login</h2>
                <hr />

                <div className="text-danger validation-summary-valid" role="alert" data-valmsg-summary="true">

				</div>

                <div className="form-floating mb-3">
					<input
					className="form-control"
					aria-required="true"
					placeholder="name@example.com"
					type="email"
					id="Input_Email"
					{...register("email", {required: true})}
					/>
                    <label className="form-label" htmlFor="Input_Email">Email</label>
					{
					errors.email &&
                    <span className="text-danger field-validation-valid" data-valmsg-for="Input.Email" data-valmsg-replace="true">Email is required!</span>
					}
                </div>

                <div className="form-floating mb-3">
					<input
					className="form-control"
					aria-required="true"
					placeholder="password"
					type="password"
					id="Input_Password"
					{...register("password", {required: true})}
					/>
                    <label className="form-label" htmlFor="Input_Password">Password</label>
					{errors.password &&
                    <span className="text-danger field-validation-valid" data-valmsg-for="Input.Password" data-valmsg-replace="true">Password is required!</span>
					}
                </div>
				<div>
					<button id="login-submit" type="submit" className="w-100 btn btn-lg btn-primary">Log in</button>
				</div>
			</form>
			</div>
		</div >
		</>
	);
}
