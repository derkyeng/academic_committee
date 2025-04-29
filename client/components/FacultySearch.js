import { useState } from "react";
import styles from "./FacultySearch/FacultySearch.module.css";
import User from "./User";
import Description from "./FacultySearch/FacultyDescription";
import FacultyForm from "./FacultySearch/FacultyForm";
import { useProfiles } from "../hooks";

export default function FacultySearch({ session }) {
	const [formData, setFormData] = useState({
		name: "",
		committeeInterest: "",
		level: "0",
		rank: "",
		committees: "",
	});

	const [profiles, searchForFaculty] = useProfiles();

	return (
		<div className={styles.faculty_search_comp}>
			<div className={styles.search_container}>
				<Description>
					Fill out the fields below to find faculty with specific committee interests, tenure status, 
					a particular name, or other specifications. If you are not concerned with a particular field 
					(i.e., name does not matter for your search), then leave the field as N/A. Leaving all fields 
					as N/A will retrieve all faculty.
				</Description>

				<FacultyForm
					formData={formData}
					handleFormChange={(newData) => setFormData(newData)}
					handleFormSubmit={(filters) => searchForFaculty(filters)}
				/>
			</div>

			{profiles && profiles.length > 0 ? (
				<div className={styles.results_container}>
					<h2 className={styles.results_heading}>Search Results ({profiles.length})</h2>
					<div className={styles.user_grid}>
						{profiles.map((user) => (
							<div className={styles.user_card} key={user.id}>
								<User user={user} key={user.id} />
							</div>
						))}
					</div>
				</div>
			) : profiles && profiles.length === 0 ? (
				<div className={styles.no_results}>
					<p>No faculty members found matching your criteria.</p>
				</div>
			) : null}
		</div>
	);
}
