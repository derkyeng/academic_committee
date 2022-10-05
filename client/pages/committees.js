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
        <div style={BUTTON_WRAPPER_STYLES} onClick={() => console.log('clicked')}>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>

        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        </Modal>
      </div>
    </div>
  )
}

export default committees