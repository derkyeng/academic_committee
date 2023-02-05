import FacultySelect from "./FacultySelect";

export default function RankSelect({ formData, handleFormChange }) {
    const rankOptions = [
        {
            value: "",
            label: "N/A",
        },
        {
            value: "fullProfessorTenured",
            label: "Full Professor",
        },
        {
            value: "associateProfessor",
            label: "Associate Professor",
        },
        {
            value: "AssistantProfessor",
            label: "Assistant Professor",
        },
        {
            value: "AthleticFaculty",
            label: "Atheltic Faculty",
        },
    ];

    return (
        <FacultySelect
            title="Rank"
            id="rank"
            formData={formData}
            handleFormChange={handleFormChange}
            options={rankOptions}
        />
    );
}
