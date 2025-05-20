"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Header() {
	const { accountInfo, setAccountInfo} = useContext(AccountContext);


	const router = useRouter();
	const accountServcie = new AccountService();

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();

		const jwt = accountInfo?.jwt;
		const refreshToken = accountInfo?.refreshToken;

		if (jwt && refreshToken) {

			try {
				var result = await accountServcie.logout(jwt, refreshToken);

				if(result.errors) {
					console.log("Logout error", result.errors[0]);
					return;
				}

				localStorage.removeItem("_jwt");
				localStorage.removeItem("_refreshToken");

				setAccountInfo!({
					jwt: undefined,
					refreshToken: undefined
				});
				router.push("/login");

			} catch (error) {
				console.log("Logout error", (error as Error).message);
			}
		}
	};

	return (
		<>
		<nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
			<div className="container">
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
						aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">

					<ul className="navbar-nav flex-grow-1">
						<li className="nav-item">
							<Link className="nav-link text-dark" href="/">Home</Link>
						</li>

						<li className="nav-item">
							{accountInfo?.jwt &&
							<Link className="nav-link text-dark" href="/tag">Tags</Link>
}
						</li>
					</ul>

					<ul className="navbar-nav">
					{!accountInfo?.jwt && (
						<>
						<li className="nav-item">
							<Link className="nav-link text-dark" href="/login">Login</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link text-dark" href="/register">Register</Link>
						</li>
						</>
					)}
					{accountInfo?.jwt && (
						<li className="nav-item">
						<a className="nav-link text-dark" href="#" onClick={handleLogout}>Logout</a>
						</li>
					)}
</ul>
				</div>
			</div>
		</nav>
		</>
	);
}
