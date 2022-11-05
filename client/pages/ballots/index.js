import Ballot from "../../components/Ballots";
import Modal from "../../components/Modal";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import Link from "next/link";

function polls() {
  const [ballots, setBallots] = useState([]);
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

  const getData = async () => {
    let { data: ballots_data, error } = await supabase
      .from("ballots")
      .select("*");
    if (error) {
      console.error(error);
      return;
    }
    console.log(ballots_data);
    setBallots(ballots_data);
  };

  const insertData = async (name, description) => {
    let { data, error } = await supabase
      .from("committees")
      .insert([{ display_name: name, description: description }]);
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {ballots.length == 0
        ? "loading"
        : ballots.map((committee_item) => (
            <Ballot ballot={committee_item} key={committee_item.id} />
          ))}

      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(list) => {
          setIsOpen(false);
          console.log(list);
          insertData(list.committeeName, list.committeeDescription);
        }}
      />
    </div>
  );
}

export default polls;
