import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Card, Button, Avatar } from "flowbite-react";
import Link from "next/link";
import { useAvatar } from "../hooks";

function User({ user }) {
	const [profilePic] = useAvatar(user.id);
	const [admin, setAdmin] = useState(user.admin)
	const makeAdmin = async () => {
        let { data: status, error } = await supabase
            .from("profiles")
            .select("admin")
            .eq("id", user.id);
        console.log(status[0].admin);
        if (status[0].admin) {
            const { data, error } = await supabase
                .from("profiles")
                .update({ admin: false })
                .eq("id", user.id);
			setAdmin(false)
        } else {
            const { data, error } = await supabase
                .from("profiles")
                .update({ admin: true })
                .eq("id", user.id);
			setAdmin(true)
        }
    };

	return (
		<div className="cursor-pointer">
			<Link
				href={{
					pathname: "/faculty/" + user.id,
					query: user,
				}}
			>
				<Card>
					<Avatar img={profilePic} rounded={true} />
					<h1>{user.username}</h1>
					<div style={{ display: "flex", marginLeft: "auto" }}>
						{!admin ? 
							(<Button onClick={(e) => {
								e.stopPropagation();
								makeAdmin()
								}}>
								Give Admin Status</Button>) 
							: 
							(<Button onClick={(e) => {
								e.stopPropagation();
								makeAdmin()
							}}>Remove Admin Status</Button>)}
					</div>
				</Card>
			</Link>
		</div>
	);
}

export default User;
