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
							style={{
								display: "inline-block",
								flexDirection: "row",
								width: "60px",
							}}
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
						<div className="flex space-x-4">
							<Avatar 
								img="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" 
								rounded
							>
								<div className="space-y-1 font-medium dark:text-white">
									<div>{name}</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{email}
									</div>
								</div>
							</Avatar>
							<Dropdown
								label="Menu"
								color="light"
								dismissOnClick={false}
							>
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
								<Dropdown.Item
									onClick={() => {
										router.push("/committees/committees");
									}}
								>
									Committees
								</Dropdown.Item>

								<Dropdown.Item
									onClick={() => {
										router.push(
											"/faculty/" + session.user.id
										);
										window.location.reload;
									}}
								>
									My Profile
								</Dropdown.Item>
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
										const { error } =
											await supabase.auth.signOut();
										router.push("/");
										window.location.reload();
									}}
								>
									Sign out
								</Dropdown.Item>
							</Dropdown>
						</div>
					)}
				</div>
			</Navbar>
		</div>
	);
};

export default Navigationbar;
