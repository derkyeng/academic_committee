import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import FacultySearch from "../components/FacultySearch";
import styles from "../styles/Home.module.css";
import { Card } from "flowbite-react";
import AccountView from "../components/Account";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";

export default function Home({ session }) {
	const router = useRouter();
	const getProfileWithEmail = async (email) => {
		let { data: profiles, error } = await supabase
			.from("faculty_profiles")
			.select()
			.eq("email", email);
		if (error) {
			console.error(error);
			return;
		}
		console.log(profiles);
		if (profiles.length == 0) {
			console.log("profile does not exist");
		} else {
			console.log(profiles);
		}
	};

	useEffect(() => {
		getProfileWithEmail(session?.user.email);
	}, [session]);

	return (
		<div style={{ padding: "50px 0 100px 0", margin: "15px", textAlign: "center" }}>
			{session ? (
				<Card>
					<h1 className={styles.header}>Welcome to the Hamilton College Academic Committee Website!</h1>
					<h2 className={styles.header_2}>Click the button below to view and edit your profile.</h2>
					<div className={styles.signIn}>
						<Button
							type="submit"
							onClick={() => {
								router.push("/account");
							}}
						>
							Edit Profile
						</Button>
					</div>
				</Card>
			) : (
				<div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
					<h1 className={styles.header}>Welcome to Hamilton College Academic Committee</h1>
					<h2 className={styles.header_2}>Please click the Login button in the top right corner to get started</h2>
				</div>
			)}
		</div>
	);
}
