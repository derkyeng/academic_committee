import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import User from '../../components/User';



const Details = () => {
  const [committee, setCommittee] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [interestedProfiles, setInterestedProfiles] = useState([]);
  const router = useRouter();

  const getCommitteeWithId = async (committee_id) => {
    let { data: committee_data, error } = await supabase
      .from('committees')
      .select('*')
      .eq('id', committee_id)
    if (error) {
      console.error(error)
      return
    }
    setCommittee(committee_data[0])
  }

  const getProfileWithId = async (profile_id) => {
    let { data: profile, error } = await supabase
      .from('faculty_profiles')
      .select('*')
      .eq('employeeID', parseInt(profile_id))
    if (error) {
      console.error(error)
      return
    }
    return profile[0]
  }

  useEffect(() => {
    getCommitteeWithId(router.query.id)
  }, []);

  useEffect(() => {
    async function getData() {
      let selectProfiles = []
      let selectedInterest = []
      if (committee.members) {
        for (let i = 0; i < committee.members.length; i++){
          selectProfiles.push(await getProfileWithId(committee.members[i]))
        }
      }
      if (committee.interested) {
        for (let i = 0; i < committee.interested.length; i++){
          selectedInterest.push(await getProfileWithId(committee.interested[i]))
        }
      }
      setProfiles(selectProfiles)
      console.log(selectedInterest)
      setInterestedProfiles(selectedInterest)
    }
    getData()
  }, [committee])

  return (
    <div className="body">
      <style jsx>
        {`
          .body {
            margin: 3em;
          }
          .display {
            font: 50px Helvetica, Arial, sans-serif;
            font-weight: bold;
          }
          .big {
            margin: 20px;
            font: 30px Helvetica, Arial, sans-serif;
          }
        `}
      </style>
      <h1 className="display">{committee.display_name}</h1>
      <h2>{committee.description}</h2>
      <h1 className="big">Current Members:</h1>
      {profiles.length == 0 ? 'loading' : 
        profiles.map((user) => 
        {
          return <div>
          <User user={user} key={user.id}></User>
        </div>}
      )}
      <h1 className="big">Interested Members:</h1>
      {interestedProfiles.length == 0 ? 'loading' : 
        interestedProfiles.map((user) => 
        {
          return <div>
          <User user={user} key={user.id}></User>
        </div>}
      )}
    </div>
  );
}

export default Details;