import { Label } from "flowbite-react";
import RSelect from "react-select";

export default function AccountInterestedSelects({
	options,
	willingCommittees,
	setWillingCommittees,
	interestedCommittees,
	setInterestedCommittees,
	highInterestCommittees,
	setHighInterestCommittees,
	removeWillingCommittees,
	setRemoveWillingCommittees,
	removeInterestedCommittees,
	setRemoveInterestedCommittees,
	removeHighInterestCommittees,
	setRemoveHighInterestCommittees,
}) {
	const removeSelected = (oldOptions, toRemove) => {
		return oldOptions.filter((item) => !toRemove.includes(item));
	};
	return (
		<div className="mb-8">
			<h2 className="mt-4 text-lg font-bold">
				Select the committees you are interested in serving on.{" "}
			</h2>
			<div className="mt-2 ">
				<Label htmlFor="willing">Willing to Serve</Label>
				<RSelect
					isMulti
					id="willing"
					name="Willing To Serve"
					className="basic-multi-select"
					classNamePrefix="select"
					options={removeSelected(options, [
						...interestedCommittees,
						...highInterestCommittees,
					])}
					value={willingCommittees}
					onChange={(interests) => {
						// Removal Occured
						if (interests.length < willingCommittees.length) {
							let difference = willingCommittees.filter(
								(committee) => !interests.includes(committee)
							);
							if (!removeWillingCommittees.includes(difference[0].value)) {
								setRemoveWillingCommittees((current) => [
									...current,
									difference[0].value,
								]);
							}
						}
						setWillingCommittees(interests);
					}}
				/>
			</div>
			<div className="mt-2 ">
				<Label htmlFor="interestedcommittees">Interested in Serving</Label>
				<RSelect
					isMulti
					id="interestedcommittees"
					name="Interested Committees"
					className="basic-multi-select"
					classNamePrefix="select"
					options={removeSelected(options, [
						...willingCommittees,
						...highInterestCommittees,
					])}
					value={interestedCommittees}
					onChange={(interests) => {
						// Removal Occured
						if (interests.length < interestedCommittees.length) {
							let difference = interestedCommittees.filter(
								(committee) => !interests.includes(committee)
							);
							if (!removeInterestedCommittees.includes(difference[0].value)) {
								setRemoveInterestedCommittees((current) => [
									...current,
									difference[0].value,
								]);
							}
						}
						setInterestedCommittees(interests);
					}}
				/>
			</div>
			<div className="mt-2">
				<Label htmlFor="highinterest">High Interest in Serving</Label>
				<RSelect
					isMulti
					id="highinterest"
					name="High Interest Commmittees"
					className="basic-multi-select"
					classNamePrefix="select"
					options={removeSelected(options, [
						...willingCommittees,
						...interestedCommittees,
					])}
					value={highInterestCommittees}
					onChange={(interests) => {
						// Removal Occured
						console.log("High Interest Change");
						console.log(interests.length);
						console.log(removeHighInterestCommittees.length);
						if (interests.length < highInterestCommittees.length) {
							let difference = highInterestCommittees.filter(
								(committee) => !interests.includes(committee)
							);
							console.log(difference.value);
							if (!removeHighInterestCommittees.includes(difference[0].value)) {
								setRemoveHighInterestCommittees((current) => [
									...current,
									difference[0].value,
								]);
							}
						}
						setHighInterestCommittees(interests);
					}}
				/>
			</div>
		</div>
	);
}
