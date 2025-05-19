"use client";

import { SubmitHandler, useForm } from "react-hook-form";

export default function Login() {

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
			password: "Test-1"
		}
	});

	const onSubmit : SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log(data);
	};

	return (
		<>
		<div className="row">
			<div className="col-4"></div>
			<div className="col-4">



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
                    <span className="text-danger field-validation-valid" data-valmsg-for="Input.Email" data-valmsg-replace="true"></span>
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
                    <span className="text-danger field-validation-valid" data-valmsg-for="Input.Password" data-valmsg-replace="true"></span>
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
