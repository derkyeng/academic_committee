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
                        setWillingCommittees(interests);
                    }}
                />
            </div>
            <div className="mt-2 ">
                <Label htmlFor="interestedcommittees">
                    Interested in Serving
                </Label>
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
                        setHighInterestCommittees(interests);
                    }}
                />
            </div>
        </div>
    );
}
