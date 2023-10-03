import User from "./User";

const CurrentSection = ({ currentNames }) => {
	return (
		<div className="flex my-6 flex-wrap justify-center gap-4">
			{currentNames.map((user, index) => {
				return <User key={index} user={user} />;
			})}
		</div>
	);
};

export default CurrentSection;
