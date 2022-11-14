import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "./User.module.css";
import { Card, Button, Avatar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";

function User({ user, interested = false, committee, vote = false }) {
  const [profilePic, setProfilePic] = useState(null);
  const router = useRouter();

  async function getProfile() {
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`avatars/${user.id}`);
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
    getProfile();
  }, []);

  return (
    <div className={styles.user}>
      <Link href={'/faculty/' + user.employeeID}>
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
      </Link>
    </div>
  );
}

export default User;
