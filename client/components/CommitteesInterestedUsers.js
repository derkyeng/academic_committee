import InterestSection from "./CommitteesInterestSection";

function CommitteesInterestedUsers({
    admin,
    interestedUsers,
    interestedNames,
}) {
    if (!admin) return <></>;

    if (!interestedUsers) {
        return (
            <p className="mt-6 mx-auto w-fit">No Interested Faculty Members.</p>
        );
    }
    const sections = [
        {
            level: "high",
            title: "High Interest in Serving:",
        },
        {
            level: "interest",
            title: "Interested in Serving:",
        },
        {
            level: "willing",
            title: "Willing to Serve:",
        },
    ];
    return (
        <div className="mt-6 mx-20">
            <h3 className="text-lg font-bold">Interested Users:</h3>

            <div
                style={{
                    border: "solid",
                    borderRadius: "10px",
                    borderWidth: "2px",
                    borderColor: "rgb(22, 45, 255)",
                }}
                className="mt-6 "
            >
                {sections.map(({ level, title }, index) => (
                    <InterestSection
                        interestedNames={interestedNames}
                        level={level}
                        key={index}
                    >
                        {title}
                    </InterestSection>
                ))}
            </div>
        </div>
    );
}

export default CommitteesInterestedUsers;
