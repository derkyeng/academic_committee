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
		let { data: committees_data, error } = await supabase.from("committees").select("*");
		if (error) {
			console.error(error);
			return;
		}
		committees_data.sort(sort_committees);
		setCommittees(committees_data);
	};

	function sort_committees(a, b) {
		if (a.display_name < b.display_name) {
		  return -1;
		} else if (a.display_name > b.display_name) {
		  return 1;
		} else {
		  return 0;
		}
	  }

	useEffect(() => {
		getCommittees();
	}, []);

	return [committees, getCommittees];
};

export { useProfiles, useCommittees };
