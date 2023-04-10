import React from "react";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Committee from "../../components/Committee";
import AddCommitteeBar from "../../components/CommitteesDisplay/AddCommitteeBar";
import CommitteeModal from "../../components/CommitteesDisplay/CommitteeModal";
import { useCommittees } from "../../hooks";
import { supabase } from "../../utils/supabaseClient";
function committees() {
	const [committees] = useCommittees();
	const [modal, setModal] = useState(false);
	const [session, setSession] = useState(null);
	useEffect(() => {
		const setAuthSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (!error) {
				setSession(data);
			} else {
				console.error(error);
			}
		};
		setAuthSession();
	}, []);
	useEffect(() => {
		console.log(session?.session);
	}, [session]);
	return (
		<div>
			{session?.admin ? (
				<div>
					<AddCommitteeBar openModal={() => setModal(true)} />
					<CommitteeModal closeModal={() => setModal(false)} modal={modal} />
				</div>
			) : (
				<></>
			)}
			<h1
				style={{
					fontWeight: "bold",
					fontSize: "35px",
					marginBottom: "30px",
				}}
			>
				Elected Committees
			</h1>
			{committees.length == 0
				? "loading"
				: committees.map((committee_item) =>
						committee_item.elected ? <Committee committee={committee_item} key={committee_item.id} /> : <></>
				  )}

			<h1
				style={{
					fontWeight: "bold",
					fontSize: "35px",
					marginBottom: "30px",
				}}
			>
				Appointed Committees
			</h1>
			{committees.length == 0
				? "loading"
				: committees.map((committee_item) =>
						!committee_item.elected ? <Committee committee={committee_item} key={committee_item.id} /> : <></>
				  )}
		</div>
	);
}

export default committees;
