"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";

export default function Register() {
	const { setAccountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const accountService = new AccountService();

	type Inputs = {
		email: string;
		displayName: string;
		bio: string;
		profilePicture: string;
		password: string;
		confirmPassword: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm<Inputs>({
		defaultValues: {
			email: "",
			displayName: "",
			bio: "",
			profilePicture: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setErrorMessage("Loading...");

		if (data.password !== data.confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			const result = await accountService.register(
				data.email,
				data.password,
				data.displayName,
				data.profilePicture,
				data.bio
			);

			if (result.errors) {
				setErrorMessage(result.errors[0]);
				return;
			}

			setAccountInfo!({
				jwt: result.data!.jwt,
				refreshToken: result.data!.refreshToken,
			});

			localStorage.setItem("_jwt", result.data!.jwt);
			localStorage.setItem("_refreshToken", result.data!.refreshToken);

			setErrorMessage("");
			router.push("/");
		} catch (err) {
			setErrorMessage("Register failed - " + (err as Error).message);
		}
	};

	return (
		<>
			<div className="row">
				<div className="col-md-4">
					{errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

					<form onSubmit={handleSubmit(onSubmit)}>
						<h2>Create a new account</h2>
						<hr />

						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="email"
								id="Input_Email"
								placeholder="Email"
								{...register("email", { required: "Email is required" })}
							/>
							<label htmlFor="Input_Email">Email</label>
							{errors.email && <span className="text-danger">{errors.email.message}</span>}
						</div>

						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="text"
								id="Input_DisplayName"
								placeholder="User Name"
								{...register("displayName", { required: "Display name is required" })}
							/>
							<label htmlFor="Input_DisplayName">User Name</label>
							{errors.displayName && <span className="text-danger">{errors.displayName.message}</span>}
						</div>

						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="text"
								id="Input_Bio"
								placeholder="Bio"
								{...register("bio")}
							/>
							<label htmlFor="Input_Bio">Bio</label>
						</div>

						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="text"
								id="Input_ProfilePicture"
								placeholder="Profile Picture URL"
								{...register("profilePicture")}
							/>
							<label htmlFor="Input_ProfilePicture">Profile Picture (WIP)</label>
						</div>

						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="password"
								id="Input_Password"
								placeholder="Password"
								{...register("password", {
									required: "Password is required",
									minLength: { value: 6, message: "Password must be at least 6 characters" },
								})}
							/>
							<label htmlFor="Input_Password">Password</label>
							{errors.password && <span className="text-danger">{errors.password.message}</span>}
						</div>

						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="password"
								id="Input_ConfirmPassword"
								placeholder="Confirm Password"
								{...register("confirmPassword", {
									required: "Please confirm your password",
								})}
							/>
							<label htmlFor="Input_ConfirmPassword">Confirm Password</label>
							{errors.confirmPassword && (
								<span className="text-danger">{errors.confirmPassword.message}</span>
							)}
						</div>

						<button type="submit" className="w-100 btn btn-lg btn-primary">
							Register
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
