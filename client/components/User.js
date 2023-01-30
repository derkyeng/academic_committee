import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Card, Button, Avatar } from "flowbite-react";

function User({ user }) {
	const [profilePic, setProfilePic] = useState(null);

	// Make this better in the future
	async function getProfilePic(user) {
		console.log(user);
		const id = user.id;
		const { data } = supabase.storage.from("avatars").getPublicUrl(`avatars/${id}`);
		let isUndefined = data.publicUrl.substr(data.publicUrl.length - 9);
		if (isUndefined !== "undefined") {
			setProfilePic(data.publicUrl);
		} else {
			setProfilePic(
				"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
			);
		}
	}

	useEffect(() => {
		getProfilePic(user);
	}, []);

	return (
		<div>
			<Link>
				<Card>
					<Avatar img={profilePic} rounded={true} />
					<h1>{user.username}</h1>
				</Card>
			</Link>
		</div>
	);
}

export default User;
