import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import FacultySearch from "../components/FacultySearch";
import styles from "../styles/Home.module.css";
import { Card } from "flowbite-react";
import AccountView from "../components/Account";
import { useRouter } from "next/router";

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
			{session && (
				<Card
					onClick={() => {
						router.push("/account");
					}}
				>
					<h1>Welcome to Hamilton College Academic Committee Organizer</h1>{" "}
					<h2>Click here to go edit your profile.</h2>
				</Card>
			)}
		</div>
	);
}
