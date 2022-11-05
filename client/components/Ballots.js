import React, { useEffect, useState } from "react";
import styles from "./Committee.module.css";
import { Avatar, Card } from "flowbite-react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";

function Ballot({ ballot }) {
  const [committee, setCommittee] = useState(null);
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
      ballot.candidates.map(async (candidate) => {
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url, rank`)
          .eq("id", candidate)
          .single();
        console.log(data);
        users.push(data);
        return data;
      })
    );
    setUsers(users);
  };

  useEffect(() => {
    getCommittee(ballot.committee);
    loadUsers();
  }, []);

  return (
    <div className={styles.card}>
      {committee && (
        <Link href={"/committees/" + ballot.id}>
          <Card href="#">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              {committee.display_name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {committee.description}
            </p>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              Candidates
            </h5>
            {users.map((user) => {
              console.log(user);
              return (
                <div>
                  <Avatar img={user.avatar_url} />
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {user.username}
                  </p>
                </div>
              );
            })}
          </Card>
        </Link>
      )}
    </div>
  );
}

export default Ballot;
