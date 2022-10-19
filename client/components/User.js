import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from './User.module.css'
import {
    Card,
    Button,
    Avatar
  } from "flowbite-react";

function User({user}) {
    const [profilePic, setProfilePic] = useState(null);

    async function getProfile() {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(`avatars/${user.id}`);
        console.log(data.publicUrl);
        setProfilePic(data.publicUrl);
    }

    useEffect(() => {
        getProfile()
    }, []);
    return(
        <div className={styles.user}>
            <Card href="#">
                <Avatar img={profilePic} rounded={true} />
                <p className={styles.profile_name}>{user.username}</p>
                <p>{user.description}</p>
                <Button
                    className="button primary block"
                    style={{marginLeft: "auto"}}
                >
                Add to Ballot
                </Button>
          </Card>
        </div>
      );
}

export default User