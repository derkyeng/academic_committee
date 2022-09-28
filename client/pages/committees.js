import Committee from "../components/Committee";
import React from 'react'
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

function committees() {
  const [committees, setCommittees] = useState([]);

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

  useEffect(() => {
    getData()
  }, []);

  return (
    <div>
      {committees.length == 0 ? 'loading' : 
      committees.map((committee_item) => 
        <Committee committee={committee_item} key={committee_item.committee_name}/>
      )}
      
    </div>
  )
}

export default committees