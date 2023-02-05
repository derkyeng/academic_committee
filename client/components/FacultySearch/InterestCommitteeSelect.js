import CommitteeSelect from "./CommitteeSelect";

export default function InterestedCommitteeSelect({
    formData,
    handleFormChange,
}) {
    return (
        <CommitteeSelect
            title="Interested Committees"
            id="committeeInterest"
            formData={formData}
            handleFormChange={handleFormChange}
        />
    );
}
