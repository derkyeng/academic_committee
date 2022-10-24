import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";


const Details = () => {
  const [committee, setCommittee] = useState({});

  const router = useRouter();
  const getCommitteeWithId = async (committee_id) => {
    let { data: committee, error } = await supabase
      .from('committees')
      .select('*')
      .eq('id', committee_id)
    if (error) {
      console.error(error)
      return
    }
    console.log(committee)
    setCommittee(committee[0])
  }

  useEffect(() => {
    getCommitteeWithId(router.query.id)
    console.log(committee)
  }, []);

  return (
    <div>
      <h1>{committee.display_name}</h1>
      <h1>Description: </h1>
      <h2>{committee.description}</h2>
    </div>
  );
}

export default Details;