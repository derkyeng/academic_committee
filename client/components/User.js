import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "./User.module.css";
import { Card, Button, Avatar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoTrueAdminApi } from "@supabase/supabase-js";

function User({
  user,
  interested = false,
  committee,
  vote = false,
  adminStatus = false,
  removeButton = false,
  votingCallback,
}) {
  const [profilePic, setProfilePic] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [profile, setProfile] = useState(user);
  const [onBallot, setOnBallot] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("is profile", profile);
    if (profile && committee && profile.ballots !== null) {
      setOnBallot(profile.ballots.includes(committee.id));
    }
  }, [profile]);

  async function getProfilePic() {
    console.log(user);
    setAdmin(user.admin);
    const id = user.profiles_id;
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`avatars/${id}`);
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

  // const addToBallot = async () => {
  //     console.log("add to ballot");
  //     const { data: ucommittee } = await supabase
  //         .from("committees")
  //         .select("*")
  //         .eq("id", committee.id);
  //     console.log();
  //     let ballot = ucommittee[0].ballot;
  //     if (!ballot) {
  //         ballot = [];
  //     }
  //     if (ballot.includes(user.employeeID)) {
  //         return;
  //     }
  //     ballot.push(user.employeeID);
  //     const updates = {
  //         id: ucommittee[0].id,
  //         ballot: ballot,
  //     };
  //     const { error } = await supabase.from("committees").upsert(updates);
  //     console.error(error);
  // };

  const addToBallot = async () => {
    console.log("hello", profile);
    let { data: profile, error } = await supabase
      .from("faculty_profiles")
      .select()
      .eq("employeeID", user.employeeID)
      .single();
    if (error) {
      return;
    }
    const currentBallots = profile.ballots || [];
    const { data, error2 } = await supabase
      .from("faculty_profiles")
      .update({
        ballots: [...currentBallots, committee.id],
      })
      .eq("employeeID", user.employeeID)
      .select("*")
      .single();
    setProfile(data);
  };

  const removeFromBallot = async () => {
    let { data: profile, error } = await supabase
      .from("faculty_profiles")
      .select()
      .eq("employeeID", user.employeeID)
      .single();
    if (error) {
      return;
    }
    const currentBallots = profile.ballots || [];
    const newBallots = profile.ballots.filter(
      (ballot) => ballot !== committee.id
    );
    const { data, error2 } = await supabase
      .from("faculty_profiles")
      .update({
        ballots: newBallots,
      })
      .eq("employeeID", user.employeeID)
      .select("*")
      .single();
    setProfile(data);
  };

  const removeFromCommittee = async (user) => {
    let { data: faculty_profiles, error } = await supabase
      .from("faculty_profiles")
      .select("*")
      .eq("email", user.email);
    console.log(faculty_profiles[0]);

    console.log(router.query.id);
    if (faculty_profiles[0].committees) {
      let profile_committees = faculty_profiles[0].committees.filter(
        (item) => item != router.query.id
      );
      console.log(profile_committees);
      const { data, error } = await supabase
        .from("faculty_profiles")
        .update({ committees: profile_committees })
        .eq("email", user.email);
    }

    let { data: committeeData, error2 } = await supabase
      .from("committees")
      .select("*")
      .eq("id", router.query.id);
    console.log(committeeData[0]);
    if (committeeData[0].members) {
      let umembers = committeeData[0].members.filter(
        (item) => item != user.employeeID
      );
      const { data, error } = await supabase
        .from("committees")
        .update({ members: umembers })
        .eq("id", router.query.id);
    }
    window.location.reload();
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
          {removeButton ? (
            <Button
              style={{ marginRight: "8px" }}
              className="button primary block"
              onClick={() => {
                removeFromCommittee(user);
              }}
            >
              <div>Remove from Committee</div>
            </Button>
          ) : (
            <div></div>
          )}

          {adminStatus && (
            <Button
              style={{ marginRight: "8px" }}
              className="button primary block"
              onClick={() => {
                makeAdmin();
              }}
            >
              <div>
                {admin ? <p>Remove Admin Status</p> : <p>Give Admin Status</p>}
              </div>
            </Button>
          )}
          {adminStatus && (
            <Button
              style={{ marginRight: "8px" }}
              className="button primary block"
              onClick={() => {
                router.push(`/faculty/${user.employeeID}`);
              }}
            >
              Visit Profile
            </Button>
          )}

          {interested && (
            <Button
              color={onBallot ? "warning" : "info"}
              className={`button block`}
              onClick={onBallot ? removeFromBallot : addToBallot}
            >
              {onBallot ? "Remove from Ballot" : "Add to Ballot"}
            </Button>
          )}
          {vote && (
            <Button
              onClick={() => {
                votingCallback(user);
              }}
              className="button primary block"
            >
              Vote
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default User;
