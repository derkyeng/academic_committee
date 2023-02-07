import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Committee from "../../components/Committee";

function id() {
	const router = useRouter();
	const user = router.query;
	const [interestedCommittees, setInterestedCommittees] = useState([]);
	const [currentCommittees, setCurrentCommittees] = useState([]);
	const [pastCommittees, setPastCommittees] = useState([]);

	const getCommittees = async () => {
		const user = router.query;
		let { data: profiles, error } = await supabase
			.from("profiles")
			.select("interested_committees, current_committees, past_committees")
			.eq("id", user.id);
		if (error) {
			return;
		}

		let interested = [];
		for (let i = 0; i < profiles[0].interested_committees.length; i++) {
			let committee = await getCommitteeWithId(profiles[0].interested_committees[i]);
			interested.push(committee);
		}
		let current = [];
		for (let i = 0; i < profiles[0].current_committees.length; i++) {
			let committee = await getCommitteeWithId(profiles[0].current_committees[i]);
			current.push(committee);
		}
		let past = [];
		for (let i = 0; i < profiles[0].past_committees.length; i++) {
			let committee = await getCommitteeWithId(profiles[0].past_committees[i]);
			past.push(committee);
		}

		setInterestedCommittees(interested);
		setCurrentCommittees(current);
		setPastCommittees(past);
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

	useEffect(() => {
		getCommittees();
	}, [router]);

	return (
		<div>
			<h1>{user.username}</h1>
			<div>
				<h1>Current Committees:</h1>
				{currentCommittees.length == 0
					? ""
					: currentCommittees.map((committee_item) => (
							<Committee committee={committee_item} key={committee_item.id} />
					  ))}
			</div>
			<div>
				<h1>Interested Committees:</h1>
				{interestedCommittees.length == 0
					? ""
					: interestedCommittees.map((committee_item) => (
							<Committee committee={committee_item} key={committee_item.id} />
					  ))}
			</div>
			<div>
				<h1>Past Committees:</h1>
				{pastCommittees.length == 0
					? ""
					: pastCommittees.map((committee_item) => (
							<Committee committee={committee_item} key={committee_item.id} />
					  ))}
			</div>
		</div>
	);
}

export default id;
