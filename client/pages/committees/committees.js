import React from "react";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { supabase } from "../../utils/supabaseClient";
import Committee from "../../components/Committee";

function committees() {
	const [committees, setCommittees] = useState([]);

	const getCommittees = async () => {
		let { data: committees_data, error } = await supabase.from("committees").select("*");
		if (error) {
			console.error(error);
			return;
		}
		console.log(committees_data);
		setCommittees(committees_data);
	};

	useEffect(() => {
		getCommittees();
	}, []);

	return (
		<div>
			{committees.length == 0
				? "loading"
				: committees.map((committee_item) => (
						<Committee committee={committee_item} key={committee_item.id} />
				  ))}
		</div>
	);
}

export default committees;
