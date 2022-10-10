import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

function dashboard() {

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
      
      getCommitteeDisplayNames()
      
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
      
      getCommitteeDescriptions()
      
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
      
    getCommitteeRequiredRanks()
      
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
      
    getProfileUsernames()
      
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
      
    getProfileRanks()
      
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
      
    getProfileIds()
      
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
      
    getProfileWithId()
    
  return (
    <div>dashboard</div>
  )
}

export default dashboard