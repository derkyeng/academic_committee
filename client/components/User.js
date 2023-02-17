import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Card, Button, Avatar } from "flowbite-react";
import Link from "next/link";
import { useAvatar } from "../hooks";

function User({ user }) {
    const [profilePic] = useAvatar(user.id);
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
                </Card>
            </Link>
        </div>
    );
}

export default User;
