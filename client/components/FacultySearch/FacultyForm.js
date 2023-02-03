import { TextInput, Button, Label } from "flowbite-react";
import styles from "./FacultySearch.module.css";
import RankSelect from "./RankSelect";
import InterestedCommitteeSelect from "./InterestCommitteeSelect";
import CommitteeSelect from "./CommitteeSelect";
import NameTextInput from "./NameTextInput";
import FacultySubmit from "./FacultySubmit";

export default function FacultyForm({
    formData,
    handleFormChange,
    searchForFaculty,
    handleFormSubmit,
}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const { name, rank, committees, committeeInterest } = formData;
        handleFormSubmit(name, rank);
    };
    return (
        <form onSubmit={handleSubmit}>
            <RankSelect
                formData={formData}
                handleFormChange={handleFormChange}
            />

            <CommitteeSelect
                formData={formData}
                handleFormChange={handleFormChange}
            />

            <InterestedCommitteeSelect
                formData={formData}
                handleFormChange={handleFormChange}
            />

            <NameTextInput
                formData={formData}
                handleFormChange={handleFormChange}
            />

            <FacultySubmit />
        </form>
    );
}