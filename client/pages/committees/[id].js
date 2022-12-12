import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import User from "../../components/User";
import { Button, Card } from "flowbite-react";

// BUG CAN OCCUR WHEN A MEMBER WHO IS ON COMMITTEE BUT NOT IN FACULTY TABLE IS FOUND

const Details = ({ session }) => {
    const [committee, setCommittee] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [interestedProfiles, setInterestedProfiles] = useState([]);
    const router = useRouter();

    const getCommitteeWithId = async (committeeId) => {
        let { data: committeeData, error } = await supabase.from("committees").select("*").eq("id", committeeId);
        if (error) {
            console.error(error);
            return;
        }
        setCommittee(committeeData[0]);
        console.log(committeeData[0]);
    };

    const getProfileWithId = async (profileId) => {
        let { data: profile, error } = await supabase.from("faculty_profiles").select("*").eq("employeeID", parseInt(profileId));
        if (error) {
            console.error(error);
            return;
        }
        if (profile[0]) {
            return profile[0];
        }
    };

    const getUserProfileWithId = async (profileId) => {
        let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", profileId);
        if (error) {
            console.error(error);
            return;
        }
        console.log(profile[0]);
        if (profile[0]) {
            return profile[0];
        }
    };

    useEffect(() => {
        if (router.query.id) {
            getCommitteeWithId(router.query.id);
        }
    }, [router.query]);

    const getData = async () => {
        console.log(committee);
        let selectProfiles = [];
        let selectedInterest = [];
        if (committee.members) {
            console.log(committee.members);
            for (let i = 0; i < committee.members.length; i++) {
                let profile = await getProfileWithId(committee.members[i]);
                selectProfiles.push(profile);
            }
        }
        if (committee.interested) {
            for (let i = 0; i < committee.interested.length; i++) {
                let profile = await getProfileWithId(committee.interested[i]);
                selectedInterest.push(profile);
            }
        }
        setProfiles(selectProfiles);
        console.log(selectedInterest);
        setInterestedProfiles(selectedInterest);
    };

    const markInterest = async () => {
        if (!session || !committee) {
            return;
        }
        const profile = (await getUserProfileWithId(session.user.id)).profile;
        console.log("add to ballot");
        let interested = committee.interested;
        if (!interested) {
            interested = [];
        }
        if (interested.includes(profile)) {
            return;
        }
        interested.push(profile);
        const updates = {
            id: committee.id,
            interested: interested,
        };
        const { error } = await supabase.from("committees").upsert(updates);
        console.error(error);
        console.log(profile);
    };

    useEffect(() => {
        if (committee) {
            getData();
        }
    }, [committee]);

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
            {committee && (
                <div>
                    <div className="flex justify-between">
                        <h1 className="display ">{committee.display_name}</h1>
                        <Button onClick={markInterest} style={{ marginTop: "4px" }}>
                            Mark Interest
                        </Button>
                    </div>
                    <h2>{committee.description || "No description"}</h2>
                    <h1 className="big">Current Members:</h1>
                    {profiles.length == 0
                        ? "Empty"
                        : profiles.map((user) => {
                              return (
                                  <div>
                                      <User user={user} key={user.id} removeButton={true}></User>
                                  </div>
                              );
                          })}
                    <h1 className="big">Interested Faculty:</h1>
                    {interestedProfiles.length == 0
                        ? "Empty"
                        : interestedProfiles.map((user) => {
                              return (
                                  <div>
                                      <User committee={committee} interested user={user} key={user.id}></User>
                                  </div>
                              );
                          })}
                </div>
            )}
        </div>
    );
};

export default Details;
