import React from "react";
import FacultySelect from "./FacultySelect";

function InterestLevel({ formData, handleFormChange }) {
    const levelOptions = [
        { value: 0, label: "Any" },
        {
            value: "1",
            label: "Willing",
        },
        {
            value: "2",
            label: "Interested",
        },
        {
            value: "3",
            label: "High Interest",
        },
    ];

    return (
        <FacultySelect
            title="Level of Interest"
            id="level"
            formData={formData}
            handleFormChange={handleFormChange}
            options={levelOptions}
        />
    );
}

export default InterestLevel;
