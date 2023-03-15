import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const useProfiles = () => {
	const [profiles, setProfiles] = useState([]);

	async function searchForFaculty(filters) {
		setProfiles([]);
		let query_username = filters.name;
		let query_rank = filters.rank;
		let query_level = filters.level;
		let query_committees = filters.committees;
		let query_interest_committee = filters.committeeInterest;
		query_username = query_username.trim().toLowerCase();
		let { data: query, error } = await supabase.from("profiles").select("*");
		let filtered_profiles = [];
		for (let i = 0; i < query.length; i++) {
			if (!query[i].username) {
				continue;
			}
			let firstName = query[i].username.toLowerCase().split(" ")[0];
			let lastName = query[i].username.toLowerCase().split(" ")[1];
			let queryFirstName = query_username.toLowerCase().split(" ")[0];
			let queryLastName = query_username.toLowerCase().split(" ")[1];
			if (!lastName) {
				lastName = "";
			}
			if (!firstName) {
				firstName = "";
			}
			let committees = query[i].current_committees;
			let interestedCommittees = query[i].interested_committees;
			if (!queryLastName) {
				if (firstName.includes(queryFirstName) || lastName.includes(queryFirstName)) {
					if (query_committees) {
						if (committees.includes(query_committees)) {
							if (query_interest_committee && query_level == 0) {
								for (let j = 1; j <= 3; j++) {
									if (interestedCommittees[j].includes(query_interest_committee)) {
										filtered_profiles.push(query[i]);
									}
								}
							} else if (query_interest_committee && query_level > 0) {
								if (interestedCommittees[query_level].includes(query_interest_committee)) {
									filtered_profiles.push(query[i]);
								}
							} else {
								filtered_profiles.push(query[i]);
							}
						}
					} else {
						if (query_interest_committee && query_level == 0) {
							for (let j = 1; j <= 3; j++) {
								if (interestedCommittees[j].includes(query_interest_committee)) {
									filtered_profiles.push(query[i]);
								}
							}
						} else if (query_interest_committee) {
							if (interestedCommittees[query_level].includes(query_interest_committee)) {
								filtered_profiles.push(query[i]);
							}
						} else {
							filtered_profiles.push(query[i]);
						}
					}
				}
			} else {
				if (firstName.includes(queryFirstName) && lastName.includes(queryLastName)) {
					if (query_committees) {
						if (committees.includes(query_committees)) {
							if (query_interest_committee && query_level == 0) {
								for (let j = 1; j <= 3; j++) {
									if (interestedCommittees[j].includes(query_interest_committee)) {
										filtered_profiles.push(query[i]);
									}
								}
							} else if (query_interest_committee) {
								if (interestedCommittees[query_level].includes(query_interest_committee)) {
									filtered_profiles.push(query[i]);
								}
							} else {
								filtered_profiles.push(query[i]);
							}
						}
					} else {
						if (query_interest_committee && query_level == 0) {
							for (let j = 1; j <= 3; j++) {
								if (interestedCommittees[j].includes(query_interest_committee)) {
									filtered_profiles.push(query[i]);
								}
							}
						} else if (query_interest_committee) {
							if (interestedCommittees[query_level].includes(query_interest_committee)) {
								filtered_profiles.push(query[i]);
							}
						} else {
							filtered_profiles.push(query[i]);
						}
					}
				}
			}
		}
		setProfiles(filtered_profiles);
		// if (query_username) {
		// 	query = query.eq("username", query_username);
		// }
		// if (query_rank) {
		// 	query = query.eq("rank", query_rank);
		// }
		// // if (query_committee.length > 0) {
		// //     query = query.eq("committee", query_committee);
		// //} //committee is arr

		// let { data: profiles_data, error } = await query;

		// if (error) {
		// 	console.error(error);
		// 	return;
		// }
		// setProfiles(profiles_data);
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

const useAvatar = (user_id) => {
	const [profilePic, setProfilePic] = useState(null);

	// Make this better in the future
	async function getProfilePic(user_id) {
		const { data } = supabase.storage.from("avatars").getPublicUrl(`avatars/${user_id}`);
		let isUndefined = data.publicUrl.substr(data.publicUrl.length - 9);
		if (isUndefined !== "undefined") {
			setProfilePic(data.publicUrl);
		} else {
			setProfilePic("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png");
		}
	}

	useEffect(() => {
		getProfilePic(user_id);
	}, []);
	return [profilePic, setProfilePic];
};

export { useProfiles, useCommittees, useAvatar };
