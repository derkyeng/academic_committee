import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { Avatar, Button } from "flowbite-react";
import Committee from "../../components/Committee";

const Details = () => {
    const [profile, setProfile] = useState({});
    const [profilePic, setProfilePic] = useState({});
    const [currentCommittees, setCurrentCommittees] = useState([]);
    const [interestedCommittees, setInterestedCommittees] = useState([]);
    const [pastCommittees, setPastCommittees] = useState([]);
    const [adminStatus, setAdminStatus] = useState(false);
    const [profileID, setProfileID] = useState();
    const router = useRouter();

    async function getProfilePic() {
        let { data: faculty_profiles, error } = await supabase
            .from("faculty_profiles")
            .select("profiles_id")
            .eq("employeeID", router.query.id);
        const id = faculty_profiles[0].profiles_id;
        const { data } = supabase.storage.from("avatars").getPublicUrl(`avatars/${id}`);
        let isUndefined = data.publicUrl.substr(data.publicUrl.length - 9);
        if (isUndefined !== "undefined") {
            setProfilePic(data.publicUrl);
        } else {
            console.log("problem");
            setProfilePic(
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
            );
        }
    }

    const getProfileWithId = async (profile_id) => {
        let { data: d_profile, error } = await supabase
            .from("faculty_profiles")
            .select("*")
            .eq("employeeID", parseInt(profile_id));
        if (error) {
            console.error(error);
            return;
        }
        console.log(d_profile);
        setProfile(d_profile[0]);
        setProfileID(parseInt(profile_id));

        let selectedCurrent = [];
        if (d_profile[0].committees) {
            console.log(d_profile[0].committees);
            for (let i = 0; i < d_profile[0].committees.length; i++) {
                let current = await getCommitteeWithId(d_profile[0].committees[i]);
                selectedCurrent.push(current);
            }
        }
        setCurrentCommittees(selectedCurrent);

        let selectedInterest = [];
        if (d_profile[0].interested_committees) {
            console.log(d_profile[0].interested_committees);
            for (let i = 0; i < d_profile[0].interested_committees.length; i++) {
                let interest = await getCommitteeWithId(d_profile[0].interested_committees[i]);
                selectedInterest.push(interest);
            }
        }
        setInterestedCommittees(selectedInterest);

        let selectedPast = [];
        if (d_profile[0].past_committees) {
            console.log(d_profile[0].past_committees);
            for (let j = 0; j < d_profile[0].past_committees.length; j++) {
                let past = await getCommitteeWithId(d_profile[0].past_committees[j]);
                selectedPast.push(past);
            }
        }
        setPastCommittees(selectedPast);
    };

    const getCommitteeWithId = async (committeeId) => {
        let { data: committeeData, error } = await supabase
            .from("committees")
            .select("*")
            .eq("id", committeeId);
        if (error) {
            console.error(error);
            return;
        }
        return committeeData[0];
    };

    async function getAdminStatus(profile_id) {
        let { data: profiles, error } = await supabase
            .from('faculty_profiles')
            .select()
            .eq('employeeID', parseInt(profile_id))
        if (error) {
          console.error(error)
          return
        }
        try {
          if (profiles[0].admin) {
            setAdminStatus(true)
          } else {
            setAdminStatus(false)
          }
        } catch {
          console.log("no admin")
        }
        
    };

    async function updateActivity(profile_id_object) {
        let profile_id = profile_id_object.profileID
        let { data: profiles, error } = await supabase
            .from('faculty_profiles')
            .select()
            .eq('employeeID', profile_id)
        if (error) {
          console.error(error)
          return
        }
        let profile = profiles[0]

        if (profile && profile.active == true) {
            // Set profile to inactive
            const { data, error } = await supabase
                .from("faculty_profiles")
                .update({
                    employeeID: profile_id,
                    chosenfirstname: profile.chosenfirstname,
                    chosenlastname: profile.chosenlastname,
                    email: profile.email,
                    interested_committees: profile.interested_committees,
                    past_committees: profile.past_committees,
                    active: false,
                    profiles_id: profile_id,
                })
                .eq("employeeID", profile_id);
        };
        
        
    };

    useEffect(() => {
        getProfileWithId(router.query.id);
        getAdminStatus(router.query.id);
        getProfilePic();
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
            <Button
                className="button primary block"
                onClick={() => {
                    updateActivity({ profileID });
                }}
            >
                Disable Account
            </Button>
            <h1 className="display">
                {profile.chosenfirstname} {profile.chosenlastname}
            </h1>
            <h2 className="big">{profile.title}</h2>
            <h2 className="big">{profile.department}</h2>
            <h2 className="big">Current Committees:</h2>
            {currentCommittees.length == 0
                ? ""
                : currentCommittees.map((committee_item) => (
                      <Committee committee={committee_item} key={committee_item.id} />
                  ))}
            <h2 className="big">Interested Committees:</h2>
            {interestedCommittees.length == 0
                ? ""
                : interestedCommittees.map((committee_item) => (
                      <Committee committee={committee_item} key={committee_item.id} />
                  ))}
            <h2 className="big">Past Committees:</h2>
            {pastCommittees.length == 0
                ? ""
                : pastCommittees.map((committee_item) => (
                      <Committee committee={committee_item} key={committee_item.id} />
                  ))}
        </div>
    );
};

export default Details;
