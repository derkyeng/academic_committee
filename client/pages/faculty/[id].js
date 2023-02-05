import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

function id() {
	const [interestedCommittees, setInterestedCommittees] = useState([]);
	const [currentCommittees, setCurrentCommittees] = useState([]);
	const [pastCommittees, setPastCommittees] = useState([]);

	const router = useRouter();

	const getCommittees = async () => {
		const user = router.query;
		let { data: profiles, error } = await supabase
			.from("profiles")
			.select("interested_committees, current_committees, past_committees")
			.eq("id", user.id);

		console.log(profiles);
		if (profiles) {
			setInterestedCommittees(profiles[0].interested_committees);
			setCurrentCommittees(profiles[0].current_committees);
			setPastCommittees(profiles[0].past_committees);
		}
	};

	useEffect(() => {
		getCommittees();
	}, [router]);

	return (
		<div>
			<div>
				<h1>Current Committees:</h1>
				{currentCommittees.length == 0 ? "loading" : currentCommittees[0]}
			</div>
			<div>
				<h1>Interested Committees:</h1>
				{interestedCommittees.length == 0 ? "loading" : interestedCommittees[0]}
			</div>
			<div>
				<h1>Past Committees:</h1>
				{pastCommittees.length == 0 ? "loading" : pastCommittees[0]}
			</div>
		</div>
	);
}

export default id;
