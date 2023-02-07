import React from "react";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import styles from "./Committee.module.css";
import EditCommitteeModal from "../components/CommitteesDisplay/EditCommitteeModal";
import Link from "next/link";

function Committee({ committee }) {
	const [modal, setModal] = useState(false);

	return (
		<div>
			{/* <Link
				href={{
					pathname: "/committees/" + committee.id,
					query: committee,
				}}
			> */}
				<Card>
					<h1>{committee.display_name}</h1>
					<h2>{committee.description}</h2>
					<img 
						src="/edit_icon.png" alt="edit button" 
						className={styles.edit_button} 
						onClick={() => setModal(true)}
					/>
 		           <EditCommitteeModal closeModal={() => setModal(false)} modal={modal} committeeId={committee.id}/>
				</Card>
			{/* </Link> */}
		</div>
	);
}

export default Committee;
