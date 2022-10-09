import Committee from "../components/Committee";
import Modal from "../components/Modal";
import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";


function committees() {
  const [committees, setCommittees] = useState([]);
  const [isOpen, setIsOpen] = useState(false)

  const BUTTON_WRAPPER_STYLES = {
    position: 'relative',
    zIndex: 1
  }
  
  const OTHER_CONTENT_STYLES = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'red',
    padding: '10px'
  }
  
  const getData = async () => {
    let { data: committees_data, error } = await supabase
      .from('committees')
      .select('*')
    if (error) {
      console.error(error)
      return
    }
    setCommittees(committees_data)
  }
  
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
      .where(`id=${profile_id}`)
    if (error) {
      console.error(error)
      return
    }
  }
  
  getProfileWithId()

  const insertData = async (name) => {
    let { data, error } = await supabase
      .from('committees')
      .insert([
        { display_name: "More Committee"},
      ])
    if (error) {
      console.error(error)
      return
    }
    console.log(data)
  }

  const enterToDatabase = () => {
    insertData()
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <div>
      {committees.length == 0 ? 'loading' : 
      committees.map((committee_item) => 
        <Committee committee={committee_item} key={committee_item.id}/>
      )}
      
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        </Modal>    
    </div>
  )
}

export default committees