"use client";

import { AccountContext } from "@/context/AccountContext";
import { TagGetAllService } from "@/services/TagService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ITag } from "@/types/domain/ITag";

export default function Tag() {

	const tagService = new TagGetAllService();
	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [data, setData] = useState<ITag[]>([]);

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}

		const fetchData = async () => {
			try {
				const result = await tagService.getAllAsync();

				if (result.errors) {
					console.log("Error fetching tags", result.errors[0]);
					return;
				}

				setData(result.data!);
			} catch (error) {
				console.log("Error fetching tags", (error as Error).message);
			}
		}

		fetchData();

	}, [accountInfo]);

	if (data.length === 0) {
		return "Loading...";
	}

	if (!accountInfo?.jwt) return null;

	return (
		<>

		<main b-wrkb45jn1q="" role="main" className="pb-3">

			<h1>Index</h1>

			<p>
				<Link href="/tag/create">Create New </Link>
			</p>

			<table className="table">
				<thead>
					<tr>
						<th>
							Name
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{data.map((item) =>
						<tr key={item.id}>
							<td>
								{item.name}
							</td>
							<td>
								<Link href={"/tag/edit/" + item.id}>Edit</Link> |
								<Link href={"/tag/delete/" + item.id}>Delete</Link>
							</td>
						</tr>
					)}

				</tbody>
			</table>

		</main>
		</>
	);
}
