"use client";

import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import BootstrapActivation from "@/helpers/BootstrapActivation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { useEffect, useState } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

	const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>();

	useEffect(() => {
		const jwt = localStorage.getItem("_jwt");
		const refreshToken = localStorage.getItem("_refreshToken");

		if (jwt && refreshToken) {
			setAccountInfo({ jwt, refreshToken });
		}
	}, []);
	return (
		<html lang="en">
		<body>
			<AccountContext.Provider value={{
				accountInfo: accountInfo,
				setAccountInfo: setAccountInfo
			}}>
				<Header />

				<div className="container">
					<main role="main" className="pb-3">
						{children}
					</main>
				</div>

				<Footer	/>

				<BootstrapActivation />
			</AccountContext.Provider>
		</body>
		</html>
	);
}
