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

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-end justify-between mb-8 border-b-2 border-blue-200 pb-6">
                <div className="flex items-end gap-4">
                    <Avatar 
                        img="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" 
                        rounded={true} 
                        size="xl" 
                    />
                    <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                </div>
                <div 
                    className="cursor-pointer hover:bg-blue-50 p-2 rounded-full"
                    onClick={() => setCommentsModal(true)}
                >
                    <img src="/messages-regular.svg" className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                        Department Chair Status
                    </label>
                    {ChairStatus()}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                        Leave Status
                    </label>
                    {LeaveStatus()}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                        Committee on Appointments
                    </label>
                    {CoaStatus()}
                </div>
            </div>

            <CommitteePreviewWrapper>
                <div className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-blue-500">
                            Current Committees
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderCommitteeItems(currentCommittees)}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-blue-500">
                            Past Committees
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderCommitteeItems(pastCommittees)}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-blue-500">
                            Interested Committees
                        </h3>
                        <div className="space-y-6">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-red-700 mb-3">
                                    Willing to Serve
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {renderCommitteeItems(willingInterestedCommittees)}
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-blue-700 mb-3">
                                    Interested in Serving
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {renderCommitteeItems(interestedCommittees)}
                                </div>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-green-700 mb-3">
                                    High Interest in Serving
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {renderCommitteeItems(highInterestedCommittees)}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </CommitteePreviewWrapper>

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
        </div>
    );
}

export default id;
