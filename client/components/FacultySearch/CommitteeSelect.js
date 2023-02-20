import FacultySelect from "./FacultySelect";
import { useCommittees } from "../../hooks";

export default function CommitteeSelect({
	title = "Committees",
	id = "committees",
	formData,
	handleFormChange,
}) {
	const [committees, getCommittees] = useCommittees();
	const committeeOptions = committees
		.map((item) => {
			return {
				value: item.id,
				label: item.display_name,
			};
		})
		.sort((a, b) => {
			const nameA = a.label.toUpperCase(); // ignore upper and lowercase
			const nameB = b.label.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			return 0;
		});
	let noValue = { value: "", label: "N/A" };
	return (
		<FacultySelect
			title={title}
			id={id}
			formData={formData}
			handleFormChange={handleFormChange}
			options={[noValue, ...committeeOptions]}
		/>
	);
}
