"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TagUpdateService, TagGetService } from "@/services/TagService";
import { AccountContext } from "@/context/AccountContext";


export default function EditTagPage() {
	const router = useRouter();
	const params = useParams();
	const [errorMessage, setErrorMessage] = useState("");
	const { accountInfo } = useContext(AccountContext);

	const tagService = new TagUpdateService();
	const tagGetService = new TagGetService();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<{ name: string }>({
		defaultValues: {
		name: ""
		}
	});

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}

		const fetchData = async () => {
		const id = params.id as string;
		if (!id) {
			setErrorMessage("Invalid tag ID");
			return;
		}

		const result = await tagGetService.getAsync(id);
		if (result.errors) {
			setErrorMessage(result.errors[0]);
			return;
		}

		setValue("name", result.data!.name);
		};

		fetchData();
	}, [params.id, setValue]);

	const onSubmit: SubmitHandler<{ name: string }> = async (data) => {
		setErrorMessage("Saving...");

		try {
		const result = await tagService.updateAsync({
			id: params.id as string,
			name: data.name
		});

		if (result.errors) {
			setErrorMessage(result.errors[0]);
			return;
		}

		setErrorMessage("");
		router.push("/tag");
		} catch (error) {
		setErrorMessage("Edit failed: " + (error as Error).message);
		}
	};

	if (!accountInfo?.jwt) return null;

	return (
		<>
		<h1>Edit Tag</h1>
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
			{errors.name && <span className="text-danger">{errors.name.message}</span>}
			</div>

			<button type="submit" className="btn btn-primary">Save</button>
		</form>
		</>
	);
}
