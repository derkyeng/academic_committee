import User from "./User";

const CurrentSection = ({ currentNames }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {currentNames.map((user, index) => {
                return <User key={index} user={user} />;
            })}
        </div>
    );
};

export default CurrentSection;
