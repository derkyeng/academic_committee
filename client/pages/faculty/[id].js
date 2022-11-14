import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import {
  Avatar
} from "flowbite-react";

const Details = () => {
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState({});
  const router = useRouter();

  async function getProfilePic() {
    setProfilePic("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png");
  }
  const getProfileWithId = async (profile_id) => {
    let { data: d_profile, error } = await supabase
      .from('faculty_profiles')
      .select('*')
      .eq('employeeID', parseInt(profile_id))
    if (error) {
      console.error(error)
      return
    }
    console.log(d_profile)
    setProfile(d_profile[0])
  }

  useEffect(() => {
    getProfileWithId(router.query.id)
    getProfilePic()
  }, []);

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
          .avatar {
            margin-bottom: 20px;
          }
        `}
      </style>
      <div className="avatar">
        <div className="w-22 rounded-full">
          <img src={profilePic} />
        </div>
      </div>
      <h1 className="display">{profile.chosenfirstname} {profile.chosenlastname}</h1>
      <h2 className="big">{profile.title}</h2>
      <h2 className="big">{profile.department}</h2>
      <h2 className="big">Committees:</h2>
      <h2 className="big">Interested Committees:</h2>
    </div>
  );
};

export default Details;
