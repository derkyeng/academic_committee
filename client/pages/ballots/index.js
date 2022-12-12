import Ballot from "../../components/Ballots";
import Modal from "../../components/Modal";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import Link from "next/link";
import Committee from "../../components/Committee";

function polls() {
  const [committees, setCommittees] = useState([]);
  const [committeeBallots, setCommitteeBallots] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const BUTTON_WRAPPER_STYLES = {
    position: "relative",
    zIndex: 1,
  };

  const OTHER_CONTENT_STYLES = {
    position: "relative",
    zIndex: 2,
    backgroundColor: "red",
    padding: "10px",
  };

  const getBallotData = async () => {
    let ballots = {};

    let { data: profiles_data, error } = await supabase
      .from("faculty_profiles")
      .select("*");
    if (error) {
      console.error(error);
      return;
    }
    console.log(profiles_data);
    for (let i = 0; i < profiles_data.length; i++) {
      if (profiles_data[i].ballots) {
        console.log(profiles_data[i].ballots);
        for (let j = 0; j < profiles_data[i].ballots.length; j++) {
          if (ballots[profiles_data[i].ballots[j]]) {
            ballots[profiles_data[i].ballots[j]].push(profiles_data[i]);
          } else {
            ballots[profiles_data[i].ballots[j]] = [profiles_data[i]];
          }
        }
      }
    }

    setCommitteeBallots(ballots);
    console.log(ballots);
  };

  const getData = async () => {
    let { data: committees_data, error } = await supabase
      .from("committees")
      .select("*");
    if (error) {
      console.error(error);
      return;
    }
    setCommittees(committees_data);
  };

  useEffect(() => {
    getData();
    getBallotData();
  }, []);

  return (
    <div>
      {committeeBallots &&
        Object.entries(committeeBallots).map(([key, value]) => {
          return <Ballot committee={key} members={value} key={key} />;
        })}
      {/* {committees.length == 0
        ? "loading"
        : committees.map((committee_item) => {
            if (
              committee_item.ballot != null &&
              committee_item.ballot.length > 0
            )
              return (
                <Ballot committee={committee_item} key={committee_item.id} />
              );
          })} */}
    </div>
  );
}

export default polls;
