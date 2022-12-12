import React, { useEffect, useState } from "react";
import styles from "./Committee.module.css";
import { Avatar, Card, Button } from "flowbite-react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import User from "./User";

function Ballot({ committee, members, session }) {
  const [users, setUsers] = useState([]);
  const [thisCommittee, setThisCommittee] = useState(null);
  const [adminStatus, setAdminStatus] = useState(null);

  async function getAdminStatus() {
    let { data: profiles, error } = await supabase
      .from("faculty_profiles")
      .select()
      .eq("email", session.user.email);
    if (error) {
      console.error(error);
      return;
    }
    console.log(profiles);
    try {
      if (profiles[0].admin) {
        setAdminStatus(true);
      } else {
        setAdminStatus(false);
      }
    } catch {
      console.log("no admin");
    }
  }

  const getCommittee = async (committee_id) => {
    let { data: committee, error } = await supabase
      .from("committees")
      .select("*")
      .eq("id", committee_id);

    setThisCommittee(committee[0]);
  };

  const loadUsers = async () => {
    const users = [];
    await Promise.all(
      committee.ballot.map(async (candidate) => {
        let { data, error, status } = await supabase
          .from("faculty_profiles")
          .select(`*`)
          .eq("employeeID", candidate)
          .single();
        const storageData = supabase.storage
          .from("avatars")
          .getPublicUrl(`avatars/${candidate}`);
        data.avatar_url = storageData.data.publicUrl;
        users.push(data);
        return data;
      })
    );
    setUsers(users);
  };

  useEffect(() => {
    getCommittee(committee);

    // loadUsers();
    console.log(users);
  }, []);

  useEffect(() => {
    if (session) {
      getAdminStatus();
    }
  }, [session]);

  const votingCallback = (user) => {
    const currentUser = session.user;
    console.log(currentUser);
    console.log(user);
  };

  return (
    <div className={styles.card}>
      {thisCommittee && (
        <Card>
          {adminStatus ? (
            <Link href={"/committees/" + committee}>
              <Button
                color="light"
                className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white "
              >
                {thisCommittee.display_name}
              </Button>
            </Link>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              {thisCommittee.display_name}
            </h1>
          )}

          <p className="font-normal text-gray-700 dark:text-gray-400">
            {thisCommittee.description || "No description"}
          </p>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
            Candidates
          </h5>
          {members.map((user) => {
            console.log(user);
            return (
              <User
                votingCallback={votingCallback}
                adminStatus={adminStatus}
                vote
                user={user}
              />
            );
          })}
        </Card>
      )}
    </div>
  );
}

export default Ballot;
