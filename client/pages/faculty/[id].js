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
    const [deptchair, setDeptChair] = useState(null);
    const [leavestatus, setLeaveStatus] = useState(null);
    const [deptChairMarked, setDeptChairMarked] = useState(null);
    const [deptChairNotMarked, setDeptChairNotMarked] = useState(null);
    const [leaveMarked, setLeaveMarked] = useState(null);
    const [leaveNotMarked, setLeaveNotMarked] = useState(null);
    const [commentsModal, setCommentsModal] = useState(false);
    const [coaMarked, setCoaMarked] = useState(null);

    const getCommitteeDetails = async (uuids) => {
        const committees = await Promise.all(
            uuids.map(async (uuid) => {
                return await getCommitteeWithId(uuid);
            })
        );
        return committees;
    };

    const getCommittees = async () => {
        const user = router.query;
        let { data: profiles, error } = await supabase
            .from("profiles")
            .select(
                "username, interested_committees, current_committees, past_committees, comment, deptchair, leavestatus, coa"
            )
            .eq("id", user.id);

        if (error) {
            return;
        }

        const userProfile = profiles[0];
        console.log("PROFILE", userProfile);

        const {
            interested_committees: interestedCommittees,
            current_committees: currentCommitteesUUIDs,
            past_committees: pastCommitteesUUIDs,
        } = userProfile;

        const willingCommittees = await getCommitteeDetails(
            interestedCommittees["1"]
        );
        const interestedCommitteesList = await getCommitteeDetails(
            interestedCommittees["2"]
        );
        const highInterestedCommittees = await getCommitteeDetails(
            interestedCommittees["3"]
        );
        const currentCommitteesList = await getCommitteeDetails(
            currentCommitteesUUIDs
        );
        const pastCommitteesList = await getCommitteeDetails(
            pastCommitteesUUIDs
        );

        setWillingInterestedCommittees(willingCommittees);
        setInterestedCommittees(interestedCommitteesList);
        setHighInterestedCommittees(highInterestedCommittees);
        setCurrentCommittees(currentCommitteesList);
        setPastCommittees(pastCommitteesList);
        setComment(userProfile.comment);
        setName(userProfile.username);

        setDeptChair(profiles[0].deptchair);
        setLeaveStatus(profiles[0].leavestatus);
        if (profiles[0].deptchair) {
            setDeptChairMarked(true);
        } else {
            setDeptChairNotMarked(true);
        }

        if (profiles[0].leavestatus) {
            setLeaveMarked(true);
        } else {
            setLeaveNotMarked(true);
        }

        if (profiles[0].coa) {
            setCoaMarked(true);
        } else {
            setCoaMarked(false);
        }
    };

    const renderCommitteeItems = (committees) => {
        return committees.map((committee_item) => {
            if (!committee_item) {
                return null;
            }

            return (
                <CommitteePreview
                    committee={committee_item}
                    key={committee_item.id}
                />
            );
        });
    };

    useEffect(() => {
        getCommittees();
        console.log(user);
    }, [router]);

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

    function ChairStatus() {
        if (deptChairMarked) {
            return (
                <div>
                    <p style={{ color: "#3399ff" }}>
                        <em>
                            You have indicated that you WILL be a
                            department/program chair next year.
                        </em>
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p style={{ color: "#cc0000" }}>
                        <em>
                            You have indicated that you will NOT be a
                            department/program chair next year.
                        </em>
                    </p>
                </div>
            );
        }
    }

    function LeaveStatus() {
        if (leaveMarked) {
            return (
                <div>
                    <p style={{ color: "#3399ff" }}>
                        <em>
                            You have indicated that you WILL be on leave for one
                            or both semesters next year.
                        </em>
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p style={{ color: "#cc0000" }}>
                        <em>
                            You have indicated that you will NOT be on leave for
                            one or both semesters next year.
                        </em>
                    </p>
                </div>
            );
        }
    }

    function CoaStatus() {
        if (coaMarked) {
            return (
                <div>
                    <p style={{ color: "#3399ff" }}>
                        <em>
                            You have indicated that you WILL have 1 yr
                            experience on COA before next year.
                        </em>
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p style={{ color: "#cc0000" }}>
                        <em>
                            You have indicated that you will NOT have 1 yr
                            experience on COA before next year.
                        </em>
                    </p>
                </div>
            );
        }
    }

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
            <div>
                <label style={{ fontWeight: "bold" }}>
                    Department Chair Status: {ChairStatus()}
                </label>

                <label style={{ fontWeight: "bold" }}>
                    Leave Status: {LeaveStatus()}
                </label>
                <label style={{ fontWeight: "bold" }}>
                    Committee on Appointments: {CoaStatus()}
                </label>
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
                    {renderCommitteeItems(currentCommittees)}
                </div>
                <div className="w-full">
                    <h3
                        className="p-2 pl-4 text-lg my-6 font-bold "
                        style={{
                            border: "solid",
                            borderRadius: "10px",
                            borderWidth: "2px",
                            borderColor: "rgb(22, 45, 255)",
                        }}
                    >
                        Past Committees:
                    </h3>
                    {renderCommitteeItems(pastCommittees)}
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
                    <h3 className="text-lg font-bold text-green-600">
                        High Interest in Serving:
                    </h3>
                    {renderCommitteeItems(highInterestedCommittees)}
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-blue-600">
                        Interested in Serving:
                    </h3>
                    {renderCommitteeItems(interestedCommittees)}
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-red-600">
                        Willing to Serve:
                    </h3>
                    {renderCommitteeItems(willingInterestedCommittees)}
                </div>
            </CommitteePreviewWrapper>
        </div>
    );
}

export default id;
