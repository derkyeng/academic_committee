import Link from "next/link";
import { Navbar, Button, Avatar, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const Navigationbar = ({ session }) => {
	const [profilePic, setProfilePic] = useState(null);
	const [name, setName] = useState(null);
	const [email, setEmail] = useState(null);
	const [adminStatus, setAdminStatus] = useState(null);
	const router = useRouter();

	async function getProfile() {
		if (session?.user) {
			const { data } = supabase.storage
				.from("avatars")
				.getPublicUrl(`avatars/${session.user.id}`);
			console.log(data.publicUrl);
			setProfilePic(data.publicUrl);
			setName(session.user.user_metadata.full_name);
			setEmail(session.user.email);
			getAdminStatus();
		}
	}

	async function getAdminStatus() {
		let { data: profiles, error } = await supabase
			.from("profiles")
			.select()
			.eq("email", session.user.email);
		if (error) {
			console.error(error);
			return;
		}
		console.log(profiles);
		try {
			if (profiles[0].admin) {
				setAdminStatus(true);
			} else {
				setAdminStatus(false);
			}
		} catch {
			console.log("no admin");
		}
	}

	useEffect(() => {
		getProfile();
	}, [session]);

	return (
		<div>
			<Navbar fluid={true} rounded={true}>
				<Navbar.Brand>
					<button
						onClick={() => {
							router.push("/");
						}}
					>
						<img
							src="/hamilton_logo.jpg"
							style={{ display: "inline-block", flexDirection: "row", width: "60px" }}
						/>
						<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
							Academic Committee
						</span>
					</button>
				</Navbar.Brand>
				<div style={{ display: "flex" }}>
					{!session?.user ? (
						<Navbar.Collapse>
							<Navbar.Link href="/login">Login</Navbar.Link>
						</Navbar.Collapse>
					) : (
						<Dropdown
							label={
								<Avatar
									img={profilePic}
									rounded={true}
									style={{ border: "1px solid blue", borderRadius: "50%" }}
								/>
							}
							arrowIcon={false}
							inline={true}
						>
							<Dropdown.Header>
								<span className="block text-sm">{name}</span>
								<span className="block truncate text-sm font-medium">{email}</span>
							</Dropdown.Header>
							{adminStatus ? (
								<Dropdown.Item
									onClick={() => {
										router.push("/faculty/dashboard");
									}}
								>
									Dashboard
								</Dropdown.Item>
							) : (
								<div></div>
							)}
							{adminStatus ? (
								<Dropdown.Item
									onClick={() => {
										router.push("/committees/committees");
									}}
								>
									Committees
								</Dropdown.Item>
							) : (
								<div></div>
							)}
							<Dropdown.Item
								onClick={() => {
									router.push("/account");
								}}
							>
								Edit Profile
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item
								onClick={async () => {
									const { error } = await supabase.auth.signOut();
									router.push("/");
								}}
							>
								Sign out
							</Dropdown.Item>
						</Dropdown>
					)}
				</div>
			</Navbar>
		</div>
	);
};

export default Navigationbar;
