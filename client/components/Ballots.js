import React, { useEffect, useState } from "react";
import styles from "./Committee.module.css";
import { Avatar, Card } from "flowbite-react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import User from "./User";

function Ballot({ committee }) {
  const [users, setUsers] = useState([]);

  const getCommittee = async (committee_id) => {
    let { data: committee, error } = await supabase
      .from("committees")
      .select("*")
      .eq("id", committee_id);

    setCommittee(committee[0]);
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
    console.log(committee);
    loadUsers();
    console.log(users);
  }, []);

  return (
    <div className={styles.card}>
      {committee && (
        <Link href={"/committees/" + committee.id}>
          <Card href="#">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              {committee.display_name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {committee.description || "No description"}
            </p>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              Candidates
            </h5>
            {users.map((user) => {
              console.log(user);
              return <User user={user} />;
            })}
          </Card>
        </Link>
      )}
    </div>
  );
}

export default Ballot;
