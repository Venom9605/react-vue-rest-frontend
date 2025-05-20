"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/context/AccountContext";
import { ITag } from "@/types/domain/ITag";
import { TagCreateService } from "@/services/TagService";

export default function CreateTagPage() {
	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	const tagService = new TagCreateService();

	type Inputs = {
		name: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Inputs>({
		defaultValues: {
		name: ""
		}
	});

	useEffect(() => {
		if (!accountInfo?.jwt) {
		router.push("/login");
		}
	}, [accountInfo]);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setErrorMessage("Creating tag...");

		try {
		const result = await tagService.addAsync({ id: "", name: data.name });

		if (result.errors) {
			setErrorMessage(result.errors[0]);
			return;
		}

		setErrorMessage("");
		router.push("/tag");
		} catch (error) {
		setErrorMessage("Create failed: " + (error as Error).message);
		}
	};

	if (!accountInfo?.jwt) return null;

	return (
		<>
		<h1>Create Tag</h1>
		<hr />
		{errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="form-floating mb-3">
			<input
				className="form-control"
				placeholder="Name"
				id="Input_Name"
				{...register("name", { required: "Name is required" })}
			/>
			<label htmlFor="Input_Name">Name</label>
			{errors.name && (
				<span className="text-danger">{errors.name.message}</span>
			)}
			</div>

			<button type="submit" className="btn btn-primary">Create</button>
		</form>
		</>
	);
}
