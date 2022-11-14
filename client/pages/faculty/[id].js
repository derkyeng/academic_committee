import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

const Details = () => {
  const [profile, setProfile] = useState({});
  const router = useRouter();

  const getProfileWithId = async (profile_id) => {
    let { data: profile, error } = await supabase
      .from('faculty_profiles')
      .select('*')
      .eq('id', profile_id)
    if (error) {
      console.error(error)
      return
    }
    setProfile(profile)
  }

  useEffect(() => {
    console.log(parseInt(router.query.id))
    getProfileWithId(parseInt(router.query.id))
    console.log(profile)
  }, []);
  return (
    <div>
      <h1>Description: </h1>
    </div>
  );
};

export default Details;
