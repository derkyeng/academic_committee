import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const useProfiles = () => {
    const [profiles, setProfiles] = useState([]);

    async function searchForFaculty(
        query_username = "",
        query_rank = ""
        // query_committees = [],
        // query_interest_committee = [],
    ) {
        setProfiles([]);
        // query_username = query_username.trim().toLowerCase();

        let query = supabase.from("profiles").select("*");

        if (query_username) {
            query = query.eq("username", query_username);
        }
        if (query_rank) {
            query = query.eq("rank", query_rank);
        }
        // if (query_committee.length > 0) {
        //     query = query.eq("committee", query_committee);
        //} //committee is arr

        let { data: profiles_data, error } = await query;

        if (error) {
            console.error(error);
            return;
        }
        setProfiles(profiles_data);
    }

    return [profiles, searchForFaculty];
};

const useCommittees = () => {
    const [committees, setCommittees] = useState([]);

    const getCommittees = async () => {
        let { data: committees_data, error } = await supabase
            .from("committees")
            .select("*");
        if (error) {
            console.error(error);
            return;
        }
        console.log("asd", committees_data);

        setCommittees(committees_data);
    };

    useEffect(() => {
        getCommittees();
    }, []);

    return [committees, getCommittees];
};

const useAvatar = (user_id) => {
    const [profilePic, setProfilePic] = useState(null);

    // Make this better in the future
    async function getProfilePic(user_id) {
        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(`avatars/${user_id}`);
        let isUndefined = data.publicUrl.substr(data.publicUrl.length - 9);
        if (isUndefined !== "undefined") {
            setProfilePic(data.publicUrl);
        } else {
            setProfilePic(
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
            );
        }
    }

    useEffect(() => {
        getProfilePic(user_id);
    }, []);
    return [profilePic, setProfilePic];
};

export { useProfiles, useCommittees, useAvatar };
