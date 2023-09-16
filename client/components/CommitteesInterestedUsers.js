function CommitteesInterestedUsers({ admin, interestedUsers }) {
    if (!admin) return <></>;

    if (!interestedUsers) {
        return (
            <p className="mt-6 mx-auto w-fit">No Interested Faculty Members.</p>
        );
    }

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
