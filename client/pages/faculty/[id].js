import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Committee from "../../components/Committee";
import { useAvatar } from "../../hooks";
import { Avatar } from "flowbite-react";

function id() {
    const router = useRouter();
    const user = router.query;
    const [name, setName] = useState(null);
    const [willingInterestedCommittees, setWillingInterestedCommittees] =
        useState([]);
    const [interestedCommittees, setInterestedCommittees] = useState([]);
    const [highInterestedCommittees, setHighInterestedCommittees] = useState(
        []
    );
    const [currentCommittees, setCurrentCommittees] = useState([]);
    const [pastCommittees, setPastCommittees] = useState([]);
    const [profilePic] = useAvatar(user.id);
    const [comment, setComment] = useState("");

    const getCommittees = async () => {
        const user = router.query;
        let { data: profiles, error } = await supabase
            .from("profiles")
            .select(
                "username, interested_committees, current_committees, past_committees, comment"
            )
            .eq("id", user.id);

        console.log(profiles);
        if (error) {
            return;
        }
        console.log(profiles[0]);
        let willing = [];
        let interested = [];
        let high = [];
        for (
            let i = 0;
            i < profiles[0].interested_committees["1"].length;
            i++
        ) {
            let committee = await getCommitteeWithId(
                profiles[0].interested_committees["1"][i]
            );
            willing.push(committee);
        }
        for (
            let i = 0;
            i < profiles[0].interested_committees["2"].length;
            i++
        ) {
            let committee = await getCommitteeWithId(
                profiles[0].interested_committees["2"][i]
            );
            interested.push(committee);
        }
        for (
            let i = 0;
            i < profiles[0].interested_committees["3"].length;
            i++
        ) {
            let committee = await getCommitteeWithId(
                profiles[0].interested_committees["3"][i]
            );
            high.push(committee);
        }
        let current = [];
        for (let i = 0; i < profiles[0].current_committees.length; i++) {
            let committee = await getCommitteeWithId(
                profiles[0].current_committees[i]
            );
            current.push(committee);
        }
        let past = [];
        for (let i = 0; i < profiles[0].past_committees.length; i++) {
            let committee = await getCommitteeWithId(
                profiles[0].past_committees[i]
            );
            past.push(committee);
        }

        setWillingInterestedCommittees(willing);
        setInterestedCommittees(interested);
        setHighInterestedCommittees(high);
        setCurrentCommittees(current);
        setPastCommittees(past);
        setComment(profiles[0].comment);
        setName(profiles[0].username);
    };

    const getCommitteeWithId = async (committeeId) => {
        let { data: committeeData, error } = await supabase
            .from("committees")
            .select("*")
            .eq("id", committeeId);
        if (error) {
            console.error(error);
            return;
        }
        return committeeData[0];
    };

    useEffect(() => {
        getCommittees();
        console.log(user);
    }, [router]);

    return (
        <div className="w-full">
            <h1 className="text-2xl underline font-bold mx-auto w-fit mt-8">
                {name}
            </h1>
            <div className="w-full flex my-6 justify-center">
                <Avatar img={profilePic} rounded={true} />
            </div>
            <div>
                <h3 className="text-lg my-6 font-bold">Comments:</h3>
                <div>
                    {comment.length == 0 ? (
                        <p className="mt-6 mx-auto w-fit"></p>
                    ) : (
                        <p>{comment}</p>
                    )}
                </div>
            </div>
            <div>
                <h3 className="text-lg my-6 font-bold">Current Committees:</h3>
                {currentCommittees.length == 0 ? (
                    <p className="mt-6 mx-auto w-fit"></p>
                ) : (
                    currentCommittees.map(
                        (committee_item) =>
                            committee_item && (
                                <Committee
                                    committee={committee_item}
                                    key={committee_item.id}
                                />
                            )
                    )
                )}
            </div>
            <div>
                <h3 className="text-lg my-6 font-bold">
                    Interested Committees:
                </h3>
                {
                    <div>
                        <h3 className="text-lg font-bold">Willing to Serve:</h3>
<<<<<<< HEAD
                        {willingInterestedCommittees.map(
                            (committee_item) =>
                                committee_item && (
                                    <Committee
                                        committee={committee_item}
                                        key={committee_item.id}
                                    />
                                )
                        )}
                        <h3 className="text-lg font-bold">
                            Interested in Serving:
                        </h3>
                        {interestedCommittees.map(
                            (committee_item) =>
                                committee_item && (
                                    <Committee
                                        committee={committee_item}
                                        key={committee_item.id}
                                    />
                                )
                        )}
                        <h3 className="text-lg font-bold">
                            High Interest in Serving:
                        </h3>

                        {highInterestedCommittees.map(
                            (committee_item) =>
                                committee_item && (
                                    <Committee
                                        committee={committee_item}
                                        key={committee_item.id}
                                    />
                                )
                        )}
=======
                        {willingInterestedCommittees.map((committee_item) => (
                            <Committee
                                committee={committee_item}
                                key={committee_item.id}
                            />
                        ))}
                        <h3 className="text-lg font-bold">
                            Interested in Serving:
                        </h3>

                        {interestedCommittees.map((committee_item) => (
                            <Committee
                                committee={committee_item}
                                key={committee_item.id}
                            />
                        ))}
                        <h3 className="text-lg font-bold">
                            High Interest in Serving:
                        </h3>
                        {highInterestedCommittees.map((committee_item) => (
                            <Committee
                                committee={committee_item}
                                key={committee_item.id}
                            />
                        ))}
>>>>>>> origin/daren_feature
                    </div>
                }
            </div>
            <div>
                <h3 className="text-lg my-6 font-bold">Past Committees:</h3>
                {pastCommittees.length == 0 ? (
                    <p className="mt-6 mx-auto w-fit"></p>
                ) : (
                    pastCommittees.map(
                        (committee_item) =>
                            committee_item && (
                                <Committee
                                    committee={committee_item}
                                    key={committee_item.id}
                                />
                            )
                    )
                )}
            </div>
        </div>
    );
}

export default id;
