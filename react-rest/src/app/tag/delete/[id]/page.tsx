"use client";

import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TagGetService, TagDeleteService } from "@/services/TagService";
import { ITag } from "@/types/domain/ITag";
import { AccountContext } from "@/context/AccountContext";

export default function DeleteTagPage() {
	const router = useRouter();
	const params = useParams();
	const [errorMessage, setErrorMessage] = useState("");
	const [tag, setTag] = useState<ITag | null>(null);
	const { accountInfo } = useContext(AccountContext);

	const tagGetService = new TagGetService();
	const tagDeleteService = new TagDeleteService();

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

		setTag(result.data!);
		};

		fetchData();
	}, [params.id]);

	const onDelete = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("Deleting...");

		try {
		const result = await tagDeleteService.deleteAsync(params.id as string);

		if (result.errors) {
			setErrorMessage(result.errors[0]);
			return;
		}

		setErrorMessage("");
		router.push("/tag");
		} catch (error) {
		setErrorMessage("Delete failed: " + (error as Error).message);
		}
	};

	if (!accountInfo?.jwt) return null;
	return (
		<>
		<h1>Delete Tag</h1>
		<hr />
		{errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

		{tag ? (
			<form onSubmit={onDelete}>
			<div className="mb-3">
				<label htmlFor="Input_Name" className="form-label">Name</label>
				<input
				id="Input_Name"
				className="form-control"
				value={tag.name}
				disabled
				readOnly
				/>
			</div>

			<button type="submit" className="btn btn-danger me-2">Delete</button>
			<button type="button" className="btn btn-secondary" onClick={() => router.push("/tag")}>
				Cancel
			</button>
			</form>
		) : (
			<p>Loading...</p>
		)}
		</>
	);
}
