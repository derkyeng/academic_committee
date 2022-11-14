import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "./User.module.css";
import { Card, Button, Avatar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";

function User({ user, interested = false, committee }) {
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

  const addToBallot = () => {
    console.log("add to ballot");
    console.log(committee);
  };

  useEffect(() => {
    getProfile();
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
        </div>
      </Card>
    </div>
  );
}

export default User;
