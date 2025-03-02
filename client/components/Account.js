import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import {
    Navbar,
    Button,
    TextInput,
    Label,
    Card,
    Select,
    FileInput,
    Checkbox,
    ListGroup,
} from "flowbite-react";
import InterestedSelects from "./AccountInterestedSelects";
import RSelect from "react-select";
import { SuccessMessage, WarningMessage } from "./Message";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [deptchair, setDeptChair] = useState(null);
    const [leavestatus, setLeaveStatus] = useState(null);
    const [coastatus, setCoaStatus] = useState(null);
    const [deptChairMarked, setDeptChairMarked] = useState(null);
    const [deptChairNotMarked, setDeptChairNotMarked] = useState(null);
    const [leaveMarked, setLeaveMarked] = useState(null);
    const [leaveNotMarked, setLeaveNotMarked] = useState(null);
    const [coaMarked, setCoaMarked] = useState(null);
    const [username, setUsername] = useState(null);
    const [hamId, setHamId] = useState(null);
    const [rank, setRank] = useState(null);
    const [willingCommittees, setWillingCommittees] = useState([]);
    const [interestedCommittees, setInterestedCommittees] = useState([]);
    const [highInterestCommittees, setHighInterestCommittees] = useState([]);
    const [pastCommittees, setPastCommittees] = useState([]);
    const [currentCommittees, setCurrentCommittees] = useState([]);
    const [removeWillingCommittees, setRemoveWillingCommittees] = useState([]);
    const [removeInterestedCommittees, setRemoveInterestedCommittees] =
        useState([]);
    const [removeHighInterestCommittees, setRemoveHighInterestCommittees] =
        useState([]);
    const [removeCurrentCommittees, setRemoveCurrentCommittees] = useState([]);
    const [removePastCommittees, setRemovePastCommittees] = useState([]);
    const [avatar_url, setAvatarUrl] = useState(null);
    const [email, setEmail] = useState(null);
    const [options, setOptions] = useState([]);
    const [AccountChangeSaved, setAccountChangeSaved] = useState([]);

    const getData = async () => {
        let { data: committees_data, error } = await supabase
            .from("committees")
            .select("*");
        if (error) {
            console.error(error);
            return;
        }
        let voptions = committees_data.map((committee) => {
            return {
                value: committee.id,
                label: committee.display_name,
            };
        });
        voptions.sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
            if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
            return 0;
        });
        setOptions(voptions);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getProfile();
        setEmail(session?.user.email);
    }, [session, options]);

    async function getCurrentUser() {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        if (!session?.user) {
            throw new Error("User not logged in");
        }

        return session.user;
    }

    async function getProfile() {
        try {
            setLoading(true);
            const user = await getCurrentUser();
            let { data, error, status } = await supabase
                .from("profiles")
                .select(
                    `username, avatar_url, rank, hamId, current_committees, past_committees, interested_committees, comment, deptchair, leavestatus, coa`
                )
                .eq("id", user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setComment(data.comment);
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
                setRank(data.rank);
                setHamId(data.hamId);
                setDeptChair(data.deptchair);
                setLeaveStatus(data.leavestatus);
                setCoaStatus(data.coa);

                if (data.deptchair) {
                    setDeptChairMarked(true);
                } else {
                    setDeptChairNotMarked(true);
                }

                if (data.leavestatus) {
                    setLeaveMarked(true);
                } else {
                    setLeaveNotMarked(true);
                }

                if (data.coa) {
                    setCoaMarked(true);
                } else {
                    setCoaMarked(false);
                }
                if (data.interested_committees && options.length > 0) {
                    console.log(data.interested_committees["1"]);
                    if (data.interested_committees["1"].length > 0) {
                        let willing = data.interested_committees["1"].map(
                            (committee) => {
                                const found = options.find(
                                    (option) => option.value == committee
                                );
                                if (!found) return null;
                                return {
                                    value: committee,
                                    label: found.label,
                                };
                            }
                        );
                        willing = willing.filter((x) => !!x);
                        console.log(willing);
                        setWillingCommittees(willing);
                    }

                    if (data.interested_committees["2"].length > 0) {
                        let interested = data.interested_committees["2"].map(
                            (committee) => {
                                const found = options.find(
                                    (option) => option.value == committee
                                );
                                if (!found) return null;
                                return {
                                    value: committee,
                                    label: found.label,
                                };
                            }
                        );
                        interested = interested.filter((x) => !!x);
                        setInterestedCommittees(interested);
                    }
                    if (data.interested_committees["3"].length > 0) {
                        let highly = data.interested_committees["3"].map(
                            (committee) => {
                                const found = options.find(
                                    (option) => option.value == committee
                                );
                                if (!found) return null;
                                return {
                                    value: committee,
                                    label: found.label,
                                };
                            }
                        );
                        highly = highly.filter((x) => !!x);
                        setHighInterestCommittees(highly);
                    }
                }
                if (data.past_committees && options.length > 0) {
                    if (data.past_committees.length > 0) {
                        let newPastCommittees = data.past_committees.map(
                            (committee) => {
                                const found = options.find(
                                    (option) => option.value == committee
                                );
                                if (!found) return null;
                                return {
                                    value: committee,
                                    label: found.label,
                                };
                            }
                        );
                        newPastCommittees = newPastCommittees.filter(
                            (x) => !!x
                        );
                        setPastCommittees(newPastCommittees);
                    }
                }
                if (data.current_committees && options.length > 0) {
                    if (data.current_committees.length > 0) {
                        let newCommittees = data.current_committees.map(
                            (committee) => {
                                const found = options.find(
                                    (option) => option.value == committee
                                );
                                if (!found) return null;
                                return {
                                    value: committee,
                                    label: found.label,
                                };
                            }
                        );
                        newCommittees = newCommittees.filter(
                            (x) => !!x
                        );
                        setCurrentCommittees(newCommittees);
                    }
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function uploadProfilePicture(path) {
        console.log(path);
        const avatarFile = path;
        // Update avatar image
        await supabase.storage
            .from("avatars")
            .remove(`avatars/${session.user.id}`);
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(`avatars/${session.user.id}`, avatarFile);
        console.log(data);
        if (error) {
            console.log(error);
        }
        // Get public url of avatar
        const { data: image_url, error2 } = supabase.storage
            .from("avatars")
            .getPublicUrl(`avatars/${session.user.id}`);
        if (error) {
            console.log(error);
        }

        // Update avatar url in user database
        const { error3 } = await supabase
            .from("profiles")
            .update({ avatar_url: image_url })
            .eq("id", session.user.id);

        setAvatarUrl(image_url);
    }

    const setCommitteeInterests = async (interests) => {
        setInterestedCommittees(interests);
        console.log(interests);
    };

    const setPastCommitteeInterests = async (interests) => {
        setPastCommittees(interests);
    };

    const setCurrentCommitteeInterests = (interests) => {
        setCurrentCommittees(interests);
    };

    async function updateProfile({
        username,
        avatar_url,
        comment,
        deptchair,
        leavestatus,
        coastatus,
    }) {
        console.log("updatesss", coastatus);
        try {
            setLoading(true);
            const user = await getCurrentUser();
            uploadProfilePicture(avatar_url);
            // const interestedCommitteesIds = interestedCommittees.map((committee) => {
            // 	return committee.value;
            // });
            const pastCommitteesIds = pastCommittees.map((committee) => {
                return committee.value;
            });

            const currentCommitteeIds = currentCommittees.map((committee) => {
                return committee.value;
            });

            const updates = {
                id: user.id,
                username,
                avatar_url,
                rank,
                updated_at: new Date(),
                email: session?.user.email,
                hamId: hamId,
                past_committees: pastCommitteesIds,
                current_committees: currentCommitteeIds,
                comment: comment,
                deptchair: deptchair,
                leavestatus: leavestatus,
                coa: coastatus,
            };

            let { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    function ChairStatus() {
        if (deptChairMarked) {
            return (
                <div>
                    <p style={{ color: "#3399ff" }}>
                        <em>
                            *You have indicated that you WILL be a department or
                            program chair for one or both semesters next year
                        </em>
                    </p>
                </div>
            );
        }
        return (
            <div>
                <p style={{ color: "#cc0000" }}>
                    <em>
                        *You have indicated that you will NOT be a department or
                        program chair for one or both semesters next year
                    </em>
                </p>
            </div>
        );
    }

    function LeaveStatus() {
        if (leaveMarked) {
            return (
                <div>
                    <p style={{ color: "#3399ff" }}>
                        <em>
                            *You have indicated that you WILL be on leave for
                            one or both semesters next year
                        </em>
                    </p>
                </div>
            );
        }
        return (
            <div>
                <p style={{ color: "#cc0000" }}>
                    <em>
                        *You have indicated that you will NOT be on leave for
                        one or both semesters next year
                    </em>
                </p>
            </div>
        );
    }

    function ExperienceStatus() {
        if (coaMarked) {
            return (
                <div>
                    <p style={{ color: "#3399ff" }}>
                        <em>
                            *You have indicated that you HAVE at least one year
                            of experience on COA
                        </em>
                    </p>
                </div>
            );
        }
        return (
            <div>
                <p style={{ color: "#cc0000" }}>
                    <em>
                        *You have indicated that you DO NOT HAVE at least one
                        year of experience on COA
                    </em>
                </p>
            </div>
        );
    }

    let updateProfileCommittees = async ({
        willingCommittees,
        interestedCommittees,
        highInterestCommittees,
    }) => {
        const user = await getCurrentUser();
        let willingCommitteesIds = willingCommittees.map(
            (committee) => committee.value
        );
        let interestedCommitteesIds = interestedCommittees.map(
            (committee) => committee.value
        );
        let highInterestCommitteesIds = highInterestCommittees.map(
            (committee) => committee.value
        );

        let compiledInterested = {
            1: willingCommitteesIds,
            2: interestedCommitteesIds,
            3: highInterestCommitteesIds,
        };

        console.log(compiledInterested);

        let { data: interestedUsers, error } = await supabase
            .from("profiles")
            .update({ interested_committees: compiledInterested })
            .eq("id", user.id);
        if (error) {
            console.log(error);
            return;
        }
        console.log(interestedUsers);
    };

    const removeCommitteeMembers = async ({
        removeWillingCommittees,
        removeInterestedCommittees,
        removeHighInterestCommittees,
    }) => {
        const user = await getCurrentUser();
        console.log("----------REMOVING---------");
        for (let i = 0; i < removeWillingCommittees.length; i++) {
            let committee = removeWillingCommittees[i];
            console.log(committee);
            let { data: willingUsersData, error } = await supabase
                .from("committees")
                .select("interested_users")
                .eq("id", committee);
            let interested = willingUsersData[0].interested_users;
            let willingUsers = interested["1"];
            let newWillingUsers = willingUsers.filter((e) => e !== user.id);
            interested["1"] = newWillingUsers;
            let { data: temp, error2 } = await supabase
                .from("committees")
                .update({ interested_users: interested })
                .eq("id", committee);
        }
        for (let i = 0; i < removeInterestedCommittees.length; i++) {
            let committee = removeInterestedCommittees[i];
            console.log(committee);
            let { data: willingUsersData, error } = await supabase
                .from("committees")
                .select("interested_users")
                .eq("id", committee);
            let interested = willingUsersData[0].interested_users;
            let willingUsers = interested["2"];
            let newWillingUsers = willingUsers.filter((e) => e !== user.id);
            interested["2"] = newWillingUsers;
            let { data: temp, error2 } = await supabase
                .from("committees")
                .update({ interested_users: interested })
                .eq("id", committee);
        }
        for (let i = 0; i < removeHighInterestCommittees.length; i++) {
            let committee = removeHighInterestCommittees[i];
            console.log(committee);
            let { data: willingUsersData, error } = await supabase
                .from("committees")
                .select("interested_users")
                .eq("id", committee);
            let interested = willingUsersData[0].interested_users;
            let willingUsers = interested["3"];
            let newWillingUsers = willingUsers.filter((e) => e !== user.id);
            interested["3"] = newWillingUsers;
            let { data: temp, error2 } = await supabase
                .from("committees")
                .update({ interested_users: interested })
                .eq("id", committee);
        }
        for (let i = 0; i < removeCurrentCommittees.length; i++) {
            let committee = removeCurrentCommittees[i];
            console.log(committee);
            let { data: willingUsersData, error } = await supabase
                .from("committees")
                .select("members")
                .eq("id", committee);
            let current = willingUsersData[0].members;
            let newCurrent = current.filter((e) => e !== user.id);
            let { data: temp, error2 } = await supabase
                .from("committees")
                .update({ members: newCurrent })
                .eq("id", committee);
        }
        for (let i = 0; i < removePastCommittees.length; i++) {
            let committee = removePastCommittees[i];
            console.log(committee);
            let { data: willingUsersData, error } = await supabase
                .from("committees")
                .select("past_members")
                .eq("id", committee);
            let past = willingUsersData[0].past_members;
            let newPast = past.filter((e) => e !== user.id);
            let { data: temp, error2 } = await supabase
                .from("committees")
                .update({ past_members: newPast })
                .eq("id", committee);
        }
        console.log("-----------END-------------");
    };

    const updateCommitteeMembers = async ({
        interestedCommittees,
        pastCommittees,
        currentCommittees,
        willingCommittees,
        highInterestCommittees,
    }) => {
        const user = await getCurrentUser();
        console.log("UPDATING COMMITTEES TABLE");
        console.log(willingCommittees);
        for (let i = 0; i < willingCommittees.length; i++) {
            let committee = willingCommittees[i].value;
            let { data: willingData, error } = await supabase
                .from("committees")
                .select("interested_users")
                .eq("id", committee);
            let interested = willingData[0].interested_users;
            let willingUsers = interested["1"];
            if (!willingUsers.includes(user.id)) {
                willingUsers.push(user.id);
            }
            interested["1"] = willingUsers;
            let { data: willingUsersData, error2 } = await supabase
                .from("committees")
                .update({ interested_users: interested })
                .eq("id", committee);
        }
        for (let i = 0; i < interestedCommittees.length; i++) {
            let committee = interestedCommittees[i].value;
            let { data: willingData, error } = await supabase
                .from("committees")
                .select("interested_users")
                .eq("id", committee);
            let interested = willingData[0].interested_users;
            let willingUsers = interested["2"];
            if (!willingUsers.includes(user.id)) {
                willingUsers.push(user.id);
            }
            interested["2"] = willingUsers;
            let { data: willingUsersData, error2 } = await supabase
                .from("committees")
                .update({ interested_users: interested })
                .eq("id", committee);
        }
        for (let i = 0; i < highInterestCommittees.length; i++) {
            let committee = highInterestCommittees[i].value;
            let { data: willingData, error } = await supabase
                .from("committees")
                .select("interested_users")
                .eq("id", committee);
            let interested = willingData[0].interested_users;
            let willingUsers = interested["3"];
            if (!willingUsers.includes(user.id)) {
                willingUsers.push(user.id);
            }
            interested["3"] = willingUsers;
            let { data: willingUsersData, error2 } = await supabase
                .from("committees")
                .update({ interested_users: interested })
                .eq("id", committee);
        }
        for (let i = 0; i < currentCommittees.length; i++) {
            let committee = currentCommittees[i].value;
            let { data: currentData, error } = await supabase
                .from("committees")
                .select("members")
                .eq("id", committee);
            let current = currentData[0].members;
            if (!current.includes(user.id)) {
                current.push(user.id);
            }
            let { data: currentUserData, error2 } = await supabase
                .from("committees")
                .update({ members: current })
                .eq("id", committee);
        }
        for (let i = 0; i < pastCommittees.length; i++) {
            let committee = pastCommittees[i].value;
            let { data: pastData, error } = await supabase
                .from("committees")
                .select("past_members")
                .eq("id", committee);
            let past = pastData[0].past_members;
            if (!past.includes(user.id)) {
                past.push(user.id);
            }
            let { data: pastUserData, error2 } = await supabase
                .from("committees")
                .update({ past_members: past })
                .eq("id", committee);
        }
    };

    const handleRadioChange = (e) => {
        if (deptChairMarked) {
            setDeptChairMarked(false);
            setDeptChairNotMarked(true);
        } else {
            setDeptChairMarked(true);
            setDeptChairNotMarked(false);
        }
        setDeptChair(e.target.value);
    };

    const handleLeaveRadioChange = (e) => {
        if (leaveMarked) {
            setLeaveMarked(false);
            setLeaveNotMarked(true);
        } else {
            setLeaveMarked(true);
            setLeaveNotMarked(false);
        }
        setLeaveStatus(e.target.value);
    };

    const handleExperienceRadioChange = (e) => {
        if (coaMarked) {
            setCoaMarked(false);
        } else {
            setCoaMarked(true);
        }
        setCoaStatus(e.target.value);
        console.log("COA TEST", coastatus);
    };

    return (
        <div className="container mx-auto py-4 max-w-4xl">
            {!hamId && <WarningMessage />}
            
            {/* Main Form Container */}
            <Card className="shadow-lg">
                {/* Personal Information Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                        Profile Information
                    </h2>

                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email" value="Email" className="text-gray-700" />
                        <TextInput
                            id="email"
                            value={session?.user.email}
                            disabled
                            className="mt-1 bg-gray-50"
                        />
                    </div>

                    {/* Grid Layout for Name and Hamilton ID */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="username" value="Full Name" className="text-gray-700" />
                            <TextInput
                                id="username"
                                value={username || ""}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="hamId" value="Hamilton ID" className="text-gray-700" />
                            <TextInput
                                id="hamId"
                                value={hamId || ""}
                                onChange={(e) => setHamId(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Rank Selection */}
                    <div>
                        <Label htmlFor="rank" value="Academic Rank" className="text-gray-700" />
                        <Select
                            id="rank"
                            value={rank || ""}
                            onChange={(e) => setRank(e.target.value)}
                            className="mt-1"
                        >
                            <option value="assistant">Assistant Professor</option>
                            <option value="full">Full Professor</option>
                            <option value="athletic">Athletic Faculty</option>
                            <option value="associate">Associate Professor</option>
                        </Select>
                    </div>

                    {/* Committee Sections */}
                    <div className="space-y-6 pt-4 border-t">
                        <h3 className="text-xl font-semibold text-gray-800">Committee Involvement</h3>
                        
                        {/* Current Committees */}
                        <div>
                            <Label value="Current Committees" className="text-gray-700" />
                            <RSelect
                                isMulti
                                options={options}
                                value={currentCommittees}
                                onChange={(interests) => {
                                    // Removal Occured
                                    if (interests.length < currentCommittees.length) {
                                        let difference = currentCommittees.filter(
                                            (committee) => !interests.includes(committee)
                                        );
                                        if (
                                            !removeCurrentCommittees.includes(
                                                difference[0].value
                                            )
                                        ) {
                                            setRemoveCurrentCommittees((current) => [
                                                ...current,
                                                difference[0].value,
                                            ]);
                                        }
                                    }
                                    setCurrentCommittees(interests);
                                }}
                                className="mt-1 border rounded-lg"
                            />
                        </div>

                        {/* Past Committees */}
                        <div>
                            <Label value="Past Committees" className="text-gray-700" />
                            <RSelect
                                isMulti
                                options={options}
                                value={pastCommittees}
                                onChange={(interests) => {
                                    // Removal Occured
                                    if (interests.length < pastCommittees.length) {
                                        let difference = pastCommittees.filter(
                                            (committee) => !interests.includes(committee)
                                        );
                                        if (
                                            !removePastCommittees.includes(
                                                difference[0].value
                                            )
                                        ) {
                                            setRemovePastCommittees((current) => [
                                                ...current,
                                                difference[0].value,
                                            ]);
                                        }
                                    }
                                    setPastCommittees(interests);
                                }}
                                className="mt-1 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Status Sections with Cards */}
                    <div className="space-y-6 pt-4 border-t">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Chair Status</h3>
                            <form>
                                <div className="radio">
                                    <label>
                                        <input
                                            type="radio"
                                            value={true}
                                            checked={deptChairMarked}
                                            onChange={handleRadioChange}
                                        />
                                        I will be a department or program chair for one or
                                        both semesters next year
                                    </label>
                                </div>

                                <div className="radio">
                                    <label>
                                        <input
                                            type="radio"
                                            value={false}
                                            checked={deptChairNotMarked}
                                            onChange={handleRadioChange}
                                        />
                                        I will NOT be a department or program chair for one
                                        or both semesters next year
                                    </label>
                                </div>
                            </form>

                            {ChairStatus()}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Status</h3>
                            <form>
                                <div className="leaveRadio">
                                    <label>
                                        <input
                                            type="radio"
                                            value={true}
                                            checked={leaveMarked}
                                            onChange={handleLeaveRadioChange}
                                        />
                                        I WILL be on leave for one or both semesters next
                                        year
                                    </label>
                                </div>

                                <div className="leaveRadio">
                                    <label>
                                        <input
                                            type="radio"
                                            value={false}
                                            checked={leaveNotMarked}
                                            onChange={handleLeaveRadioChange}
                                        />
                                        I will NOT be on leave for one or both semesters
                                        next year
                                    </label>
                                </div>
                            </form>

                            {LeaveStatus()}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">COA Experience</h3>
                            <form>
                                <div className="experienceRadio">
                                    <label>
                                        <input
                                            type="radio"
                                            value={true}
                                            checked={coaMarked}
                                            onChange={handleExperienceRadioChange}
                                        />
                                        I WILL have, at the end of this academic year, at
                                        least one year of experience on COA
                                    </label>
                                </div>
                                <div className="experienceRadio">
                                    <label>
                                        <input
                                            type="radio"
                                            value={false}
                                            checked={!coaMarked}
                                            onChange={handleExperienceRadioChange}
                                        />
                                        I WILL NOT have, at the end of this academic year,
                                        at least one year of experience on COA
                                    </label>
                                </div>
                            </form>

                            {ExperienceStatus()}
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="pt-6 border-t">
                        <Button
                            gradientMonochrome="info"
                            className="w-full md:w-auto px-8 py-2.5"
                            onClick={() => {
                                updateProfile({
                                    username,
                                    avatar_url,
                                    comment,
                                    deptchair,
                                    leavestatus,
                                    coastatus,
                                });
                                updateProfileCommittees({
                                    willingCommittees,
                                    interestedCommittees,
                                    highInterestCommittees,
                                });
                                console.log("will also update committees");
                                removeCommitteeMembers({
                                    removeWillingCommittees,
                                    removeInterestedCommittees,
                                    removeHighInterestCommittees,
                                }).then(() => {
                                    updateCommitteeMembers({
                                        interestedCommittees,
                                        pastCommittees,
                                        currentCommittees,
                                        willingCommittees,
                                        highInterestCommittees,
                                    });
                                });

                                console.log("Removing these");
                                console.log(removeWillingCommittees);
                                console.log(removeInterestedCommittees);
                                console.log(removeHighInterestCommittees);

                                setAccountChangeSaved(
                                    AccountChangeSaved.concat(<SuccessMessage />)
                                );

                                if ("caches" in window) {
                                    caches.keys().then((names) => {
                                        // Delete all the cache files
                                        names.forEach((name) => {
                                            caches.delete(name);
                                        });
                                    });

                                    // Makes sure the page reloads. Changes are only visible after you refresh.
                                }

                                // window.location.reload();
                            }}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        {AccountChangeSaved}
                    </div>
                </div>
            </Card>
        </div>
    );
}
