import React from "react";
import styles from "./Committee.module.css";
import { Button, Card } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

function Committee({ committee, ballot = false, passedProfile, profileId }) {
  const [onBallot, setOnBallot] = useState(false);
  console.log(passedProfile);
  const [profile, setProfile] = useState(passedProfile);

  useEffect(() => {
    if (profile && profile.ballots !== null) {
      setOnBallot(profile.ballots.includes(committee.id));
    }
  }, [profile]);

  const addToBallot = async () => {
    console.log("hello", profile);
    let { data: profile, error } = await supabase
      .from("faculty_profiles")
      .select()
      .eq("employeeID", profileId)
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
      .eq("employeeID", profileId)
      .select("*")
      .single();
    setProfile(data);
  };

  const removeFromBallot = async () => {
    let { data: profile, error } = await supabase
      .from("faculty_profiles")
      .select()
      .eq("employeeID", profileId)
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
      .eq("employeeID", profileId)
      .select("*")
      .single();
    setProfile(data);
  };

  return (
    <div className={styles.card}>
      <Card>
        <Link href={"/committees/" + committee.id}>
          <Button
            color="light"
            className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white "
          >
            {committee.display_name}
          </Button>
        </Link>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {committee.description || "No description"}
        </p>
        {ballot && (
          <div className="flex">
            {!onBallot ? (
              <Button style={{ marginRight: "8px" }} onClick={addToBallot}>
                Add to ballot
              </Button>
            ) : (
              <Button color="warning" onClick={removeFromBallot}>
                Remove from ballot
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Committee;
