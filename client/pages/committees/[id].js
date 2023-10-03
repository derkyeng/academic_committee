import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import User from "../../components/User";
import { Button } from "flowbite-react";
import EditCommitteeModal from "../../components/CommitteesDisplay/EditCommitteeModal";
// import CommitteesInterestedUsers from "../../components/CommitteesInterestedUsers";
import CommitteesCurrentUsers from "../../components/CommitteesCurrentUsers";

function id() {
    const router = useRouter();
    const [admin, setAdmin] = useState(false);
    const [interestedNames, setInterestedNames] = useState({
        willing: [],
        interest: [],
        high: [],
    });
    // fetch user id's from db (committees table, members column)
    const [currentUsers, setCurrentUsers] = useState([]);
    //  console.log("Check committee id", committeeId);

    // for each user id returned, fetch users from db (profiles table, multiple columns)

    const [modal, setModal] = useState(false);
    const [session, setSession] = useState(null);
    const committee = router.query;
    const getCurrentUsers = async () => {
        const { data: current, error } = await supabase
            .from("committees")
            .select("members")
            .eq("id", committee.id);
        if (error) {
            console.error(error);
            return;
        }

        const users = current.map(async (id) => {
            const { data: userObject, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", id);
            return userObject;
        });

        setCurrentUsers(users);
    };

    let interestedUsers = {};
    if (committee.interested_users) {
        interestedUsers = JSON.parse(committee.interested_users);
    }
    const getProfiles = async () => {
        let newInterestedNames = {};
        let errors = [];
        if (interestedUsers && interestedUsers["1"]) {
            let { data: willing, error1 } = await supabase
                .from("profiles")
                .select("*")
                .in("id", interestedUsers["1"]);
            errors.push(error1);
            newInterestedNames["willing"] = willing;
        }
        if (interestedUsers && interestedUsers["2"]) {
            let { data: interest, error2 } = await supabase
                .from("profiles")
                .select("*")
                .in("id", interestedUsers["2"]);
            errors.push(error2);
            newInterestedNames["interest"] = interest;
        }
        if (interestedUsers && interestedUsers["3"]) {
            let { data: high, error3 } = await supabase
                .from("profiles")
                .select("*")
                .in("id", interestedUsers["3"]);
            errors.push(error3);
            newInterestedNames["high"] = high;
        }

        errors.forEach((error) => {
            if (error) {
                console.error(error);
                return;
            }
        });
        setInterestedNames(newInterestedNames);
    };

    const sections = [
        {
            level: "willing",
            title: "Willing to Serve:",
        },
        {
            level: "interest",
            title: "Interested in Serving:",
        },
        {
            level: "high",
            title: "High Interest in Serving:",
        },
    ];

    useEffect(() => {
        getProfiles();
        getCurrentUsers();
        const setAuthSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error) {
                setSession(data);
            } else {
                console.error(error);
            }
        };
        setAuthSession();
        // console.log("Users", currentUsers);
        console.log("ID", committee.id);
    }, [router]);

    useEffect(() => {
        console.log(currentUsers);
    }, [currentUsers]);

    async function getAdminStatus(email) {
        let { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email);
        if (profiles[0]) {
            console.log(profiles[0].admin);
            setAdmin(profiles[0].admin);
        }
    }

    useEffect(() => {
        let email = session?.session.user.email;
        console.log(email);
        getAdminStatus(email);
    }, [session]);

    return (
        <div className="mt-6 bg-indigo-300">
            <h1 className="text-2xl underline font-bold mx-auto w-fit mt-8">
                {committee.display_name}
            </h1>
            {committee.description ? (
                <div className="mt-6 mx-20">
                    <h3 className="text-lg font-bold">Description:</h3>
                    <p>{committee.description}</p>
                </div>
            ) : (
                <p className="mt-6 mx-auto w-fit">No description.</p>
            )}
            <div className="w-full mt-6 flex justify-center">
                {session?.admin ? (
                    <Button
                        className="w-10 mx-auto"
                        onClick={() => setModal(true)}
                    >
                        Edit Committee
                    </Button>
                ) : (
                    <></>
                )}
            </div>
            <CommitteesCurrentUsers currentNames={currentUsers} />
            <EditCommitteeModal
                closeModal={() => setModal(false)}
                modal={modal}
                committeeId={committee.id}
                committeeName={committee.display_name}
                committeeElected={committee.elected}
            />
            {admin && committee.interested_users ? (
                <div className="mt-6 mx-20">
                    <h3 className="text-lg font-bold">Interested Users:</h3>

                    <div
                        style={{
                            border: "solid",
                            borderRadius: "10px",
                            borderWidth: "2px",
                            borderColor: "rgb(22, 45, 255)",
                        }}
                        className="mt-6 "
                    >
                        {sections.map(({ level, title }, index) => (
                            <InterestSection
                                interestedNames={interestedNames}
                                level={level}
                                key={index}
                            >
                                {title}
                            </InterestSection>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-6 mx-auto w-fit">
                    No Interested Faculty Members.
                </p>
            )}
        </div>
    );
}

export default id;
