import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "./User.module.css";
import { Card, Button, Avatar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoTrueAdminApi } from "@supabase/supabase-js";

function User({ user, interested = false, committee, vote = false }) {
    const [profilePic, setProfilePic] = useState(null);
    const [admin, setAdmin] = useState(null);
    const router = useRouter();

    async function getProfilePic() {
        console.log(user);
        setAdmin(user.admin);
        const id = user.profiles_id;
        const { data } = supabase.storage.from("avatars").getPublicUrl(`avatars/${id}`);
        let isUndefined = data.publicUrl.substr(data.publicUrl.length - 9);
        if (isUndefined !== "undefined") {
            setProfilePic(data.publicUrl);
        } else {
            console.log("problem");
            setProfilePic(
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
            );
        }
    }

    const makeAdmin = async () => {
        let { data: status, error } = await supabase
            .from("faculty_profiles")
            .select("admin")
            .eq("employeeID", user.employeeID);
        console.log(status[0].admin);
        setAdmin(!status[0].admin);
        if (status[0].admin) {
            const { data, error } = await supabase
                .from("faculty_profiles")
                .update({ admin: false })
                .eq("employeeID", user.employeeID);
        } else {
            const { data, error } = await supabase
                .from("faculty_profiles")
                .update({ admin: true })
                .eq("employeeID", user.employeeID);
        }
    };

    const addToBallot = async () => {
        console.log("add to ballot");
        const { data: ucommittee } = await supabase
            .from("committees")
            .select("*")
            .eq("id", committee.id);
        console.log();
        let ballot = ucommittee[0].ballot;
        if (!ballot) {
            ballot = [];
        }
        if (ballot.includes(user.employeeID)) {
            return;
        }
        ballot.push(user.employeeID);
        const updates = {
            id: ucommittee[0].id,
            ballot: ballot,
        };
        const { error } = await supabase.from("committees").upsert(updates);
        console.error(error);
    };

    useEffect(() => {
        getProfilePic();
    }, []);

    return (
        <div className={styles.user}>
            <Card className={styles.card}>
                <Avatar img={profilePic} rounded={true} />
                <p className={styles.profile_name}>
                    {user.chosenfirstname} {user.chosenlastname}
                </p>
                <p>{user.title}</p>
                <p>{user.Department}</p>
                <div style={{ display: "flex", marginLeft: "auto" }}>
                    <Button
                        style={{ marginRight: "8px" }}
                        className="button primary block"
                        onClick={() => {
                            makeAdmin();
                        }}
                    >
                        <div>{admin ? <p>Remove Admin Status</p> : <p>Give Admin Status</p>}</div>
                    </Button>
                    <Button
                        style={{ marginRight: "8px" }}
                        className="button primary block"
                        onClick={() => {
                            router.push(`/faculty/${user.employeeID}`);
                        }}
                    >
                        Visit Profile
                    </Button>
                    {interested && (
                        <Button className="button primary block" onClick={addToBallot}>
                            Add to Ballot
                        </Button>
                    )}
                    {vote && <Button className="button primary block">Vote</Button>}
                </div>
            </Card>
        </div>
    );
}

export default User;
