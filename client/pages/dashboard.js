import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import FacultySearch from "../components/FacultySearch";
import User from "../components/User";

function dashboard() {

    const [profiles, setProfiles] = useState([]);

    const getCommitteeDisplayNames = async () => {
        let { data: committees, error } = await supabase
          .from('committees')
          .select('display_name')
        if (error) {
          console.error(error)
          return
        }
        console.log(committees)
      }
      
    //  getCommitteeDisplayNames()
      
    const getCommitteeDescriptions = async () => {
        let { data: committees, error } = await supabase
          .from('committees')
          .select('description')
        if (error) {
          console.error(error)
          return
        }
        console.log(committees)
      }
      
    //  getCommitteeDescriptions()
      
    const getCommitteeRequiredRanks = async () => {
        let { data: committees, error } = await supabase
          .from('committees')
          .select('required_ranks')
        if (error) {
          console.error(error)
          return
        }
        console.log(committees)
    }
      
    // getCommitteeRequiredRanks()
      
    const getProfileUsernames = async () => {
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('username')
        if (error) {
          console.error(error)
          return
        }
        console.log(profiles)
      }
      
    // getProfileUsernames()
      
    const getProfileRanks = async () => {
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('rank')
        if (error) {
          console.error(error)
          return
        }
        console.log(profiles)
      }
      
    // getProfileRanks()
      
    const getProfileIds = async () => {
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('id')
        if (error) {
          console.error(error)
          return
        }
        console.log(profiles)
      }
      
    // getProfileIds()
      
    const getProfileWithId = async (profile_id) => {
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', profile_id)
        if (error) {
          console.error(error)
          return
        }
    }
      
    // getProfileWithId()

    const getData = async () => {
      let { data: profiles_data, error } = await supabase
        .from('profiles')
        .select('*')
      if (error) {
        console.error(error)
        return
      }
      setProfiles(profiles_data)
    }
    
    useEffect(() => {
      getData()
    }, []);
    
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <h1 style={{fontSize:50}}>Dashboard</h1>
      <FacultySearch></FacultySearch>
  </div>
  )
}

export default dashboard