import React from 'react'
import styles from './User.module.css'
import {
    Button,
  } from "flowbite-react";

function User({user}) {
    return(
        <div className={styles.item}>
          <p className={styles.profile_name}>{user.username}</p>
          <p>{user.description}</p>
          <Button
                className="button primary block"
                style={{marginLeft: "auto"}}
            >
                Add to Ballot
            </Button>
        </div>
      );
}

export default User