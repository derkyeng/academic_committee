import { useState, useEffect } from "react";
import styles from "./FacultySearch/FacultySearch.module.css";
import User from "./User";
import Description from "./FacultySearch/FacultyDescription";
import FacultyForm from "./FacultySearch/FacultyForm";
import { useProfiles } from "../hooks";

export default function FacultySearch({ session }) {
	const [formData, setFormData] = useState({
		name: "",
		committeeInterest: "",
		level: "1",
		rank: "",
		committees: "",
	});

	const [profiles, searchForFaculty] = useProfiles();

	return (
		<div className={styles.faculty_search_comp}>
			<Description>
				Fill out the fields below In order to find faculty with specific committee
				interests, tenure status, a particular name, or other specifications.<br></br>
				If you are not concerned with a particular field (i.e name does not matter for your
				search), then leave the field as N/A. Leaving <br></br> all fields as N/A will
				retrieve all faculty.
			</Description>

			<FacultyForm
				formData={formData}
				handleFormChange={(newData) => setFormData(newData)}
				handleFormSubmit={(filters) => searchForFaculty(filters)}
			/>
			{profiles &&
				profiles.map((user) => (
					<div className={styles.user_div} key={user.key}>
						<User user={user} key={user.id}></User>
					</div>
				))}
		</div>
	);
}
