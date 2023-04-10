import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import CommitteePreview from "../../components/CommitteePreview";
import { useAvatar } from "../../hooks";
import { Modal, Avatar } from "flowbite-react";
import CommitteePreviewWrapper from "../../components/CommitteePreviewWrapper";

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
    const [commentsModal, setCommentsModal] = useState(false);

	const getCommittees = async () => {
		const user = router.query;
		let { data: profiles, error } = await supabase
			.from("profiles")
			.select("username, interested_committees, current_committees, past_committees, comment, leavestatus")
			.eq("id", user.id);

		console.log(profiles);
		if (error) {
			return;
		}
		console.log(profiles[0]);
		let willing = [];
		let interested = [];
		let high = [];
		for (let i = 0; i < profiles[0].interested_committees["1"].length; i++) {
			let committee = await getCommitteeWithId(profiles[0].interested_committees["1"][i]);
			willing.push(committee);
		}
		for (let i = 0; i < profiles[0].interested_committees["2"].length; i++) {
			let committee = await getCommitteeWithId(profiles[0].interested_committees["2"][i]);
			interested.push(committee);
		}
		for (let i = 0; i < profiles[0].interested_committees["3"].length; i++) {
			let committee = await getCommitteeWithId(profiles[0].interested_committees["3"][i]);
			high.push(committee);
		}
		let current = [];
		for (let i = 0; i < profiles[0].current_committees.length; i++) {
			let committee = await getCommitteeWithId(profiles[0].current_committees[i]);
			current.push(committee);
		}
		let past = [];
		for (let i = 0; i < profiles[0].past_committees.length; i++) {
			let committee = await getCommitteeWithId(profiles[0].past_committees[i]);
			past.push(committee);
		}

		setWillingInterestedCommittees(willing);
		setInterestedCommittees(interested);
		setHighInterestedCommittees(high);
		setCurrentCommittees(current);
		setPastCommittees(past);
		setComment(profiles[0].comment);
		setName(profiles[0].username);
		setLeave(profiles[0].leavestatus);
	};

	const getCommitteeWithId = async (committeeId) => {
		let { data: committeeData, error } = await supabase.from("committees").select("*").eq("id", committeeId);
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
            <div className="flex items-end cursor-pointer justify-center">
                <h1 className="text-2xl underline font-bold w-fit mt-8 mr-3">
                    {name}
                </h1>
                <div
                    className="w-6 h-6"
                    onClick={() => {
                        setCommentsModal(true);
                    }}
                >
                    <img src="/messages-regular.svg"></img>
                </div>
            </div>
            <Modal
                dismissible={true}
                show={commentsModal}
                onClose={() => {
                    setCommentsModal(false);
                }}
            >
                <Modal.Header>Comments:</Modal.Header>
                <Modal.Body>
                    <div>
                        {comment.length == 0 ? (
                            <p className="mt-6 mx-auto w-fit"></p>
                        ) : (
                            <p>{comment}</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <div className="w-full flex my-6 justify-center">
                <Avatar img={profilePic} rounded={true} />
            </div>
            <div>
                <h3 className="text-lg my-6 font-bold"></h3>
            </div>
            <CommitteePreviewWrapper>
                <div className="w-full">
                    <h3
                        className="p-2 pl-4 text-lg my-6 font-bold"
                        style={{
                            border: "solid",
                            borderRadius: "10px",
                            borderWidth: "2px",
                            borderColor: "rgb(22, 45, 255)",
                        }}
                    >
                        Current Committees:
                    </h3>
                    {currentCommittees.length == 0 ? (
                        <p className="mt-6 mx-auto w-fit"></p>
                    ) : (
                        currentCommittees.map(
                            (committee_item) =>
                                committee_item && (
                                    <CommitteePreview
                                        committee={committee_item}
                                        key={committee_item.id}
                                    />
                                )
                        )
                    )}
                </div>
                <div className="w-full">
                    <h3
                        className="p-2 pl-4 text-lg my-6 font-bold"
                        style={{
                            border: "solid",
                            borderRadius: "10px",
                            borderWidth: "2px",
                            borderColor: "rgb(22, 45, 255)",
                        }}
                    >
                        Past Committees:
                    </h3>
                    {pastCommittees.length == 0 ? (
                        <p className="mt-6 mx-auto w-fit"></p>
                    ) : (
                        pastCommittees.map(
                            (committee_item) =>
                                committee_item && (
                                    <CommitteePreview
                                        committee={committee_item}
                                        key={committee_item.id}
                                    />
                                )
                        )
                    )}
                </div>
            </CommitteePreviewWrapper>

            <h3
                className="text-lg my-6 font-bold p-4"
                style={{
                    border: "solid",
                    borderRadius: "10px",
                    borderWidth: "2px",
                    borderColor: "rgb(22, 45, 255)",
                }}
            >
                Interested Committees:
            </h3>
            <CommitteePreviewWrapper>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-red-600">
                        Willing to Serve:
                    </h3>
                    {willingInterestedCommittees.map(
                        (committee_item) =>
                            committee_item && (
                                <CommitteePreview
                                    committee={committee_item}
                                    key={committee_item.id}
                                />
                            )
                    )}
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-blue-600">
                        Interested in Serving:
                    </h3>
                    {interestedCommittees.map(
                        (committee_item) =>
                            committee_item && (
                                <CommitteePreview
                                    committee={committee_item}
                                    key={committee_item.id}
                                />
                            )
                    )}
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-green-600">
                        High Interest in Serving:
                    </h3>

                    {highInterestedCommittees.map(
                        (committee_item) =>
                            committee_item && (
                                <CommitteePreview
                                    committee={committee_item}
                                    key={committee_item.id}
                                />
                            )
                    )}
                </div>
            </CommitteePreviewWrapper>
        </div>
    );

}

export default id;
