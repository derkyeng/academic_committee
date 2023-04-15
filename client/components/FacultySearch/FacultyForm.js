import { TextInput, Button, Label, Modal } from "flowbite-react";
import styles from "./FacultySearch.module.css";
import RankSelect from "./RankSelect";
import InterestedCommitteeSelect from "./InterestCommitteeSelect";
import CommitteeSelect from "./CommitteeSelect";
import NameTextInput from "./NameTextInput";
import FacultySubmit from "./FacultySubmit";
import InterestLevel from "./InterestLevel";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function FacultyForm({
	formData,
	handleFormChange,
	searchForFaculty,
	handleFormSubmit,
}) {
	const [show, setShow] = useState(false);
	const handleSubmit = (event) => {
		event.preventDefault();
		const { name, rank, level, committees, committeeInterest } = formData;
		console.log("FORM DATA");
		console.log(formData);
		handleFormSubmit({ name, rank, level, committees, committeeInterest });
	};

	const setInactive = async () => {
		let confirmation = confirm("Are you sure you want to set all users to inactive?");
		if (confirmation) {
			const { data, error } = await supabase
				.from("profiles")
				.update({ active: false })
				.eq("admin", false);
			if (error) {
				console.error(error);
				return;
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ display: "flex" }}>
			{/* <RankSelect formData={formData} handleFormChange={handleFormChange} /> */}

			<CommitteeSelect formData={formData} handleFormChange={handleFormChange} />

			<InterestedCommitteeSelect formData={formData} handleFormChange={handleFormChange} />

			<InterestLevel formData={formData} handleFormChange={handleFormChange} />

			<NameTextInput formData={formData} handleFormChange={handleFormChange} />

			<FacultySubmit />

			<Button
				className="button primary block"
				color="failure"
				style={{ marginTop: 24, marginLeft: "auto" }}
				onClick={() => setInactive()}
			>
				Set All Users To Inactive
			</Button>
		</form>
	);
}
