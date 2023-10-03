import User from "./User";

const InterestSection = ({ level, interestedNames, children }) => {
    return (
        <div className="my-6 flex flex-col items-center">
            <h3 className="text-lg font-bold">{children}</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {interestedNames[level] &&
                    interestedNames[level].map((user, index) => {
                        return <User key={index} user={user} />;
                    })}
            </div>
        </div>
    );
};

export default InterestSection;
