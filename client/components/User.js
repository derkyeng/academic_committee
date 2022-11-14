import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from './User.module.css'
import {
    Card,
    Button,
    Avatar
  } from "flowbite-react";
import Link from 'next/link';

function User({user}) {
    const [profilePic, setProfilePic] = useState(null);

    async function getProfile() {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(`avatars/${user.id}`);
        let isUndefined = (data.publicUrl.substr(data.publicUrl.length - 9));
        if (isUndefined !== "undefined"){
          setProfilePic(data.publicUrl);
        } else {
          console.log("problem")
          setProfilePic("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png");
        }
    }

    useEffect(() => {
        getProfile()
    }, []);
    return(
        <div className={styles.user}>
          <Link href={'/faculty/' + user.employeeID}>
            <Card href="#" className={styles.card}>
                  <Avatar img={profilePic} rounded={true} />
                  <p className={styles.profile_name}>{user.chosenfirstname} {user.chosenlastname}</p>
                  <p>{user.title}</p>
                  <p>{user.Department}</p>
                  <Button
                      className="button primary block"
                      style={{marginLeft: "auto"}}
                  >
                  Add to Ballot
                  </Button>
            </Card>
          </Link>
        </div>
      );
}

export default User