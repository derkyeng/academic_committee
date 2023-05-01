import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import User from "../../components/User";
import { Button } from "flowbite-react";
import EditCommitteeModal from "../../components/CommitteesDisplay/EditCommitteeModal";

const InterestSection = ({ level, interestedNames, children }) => {
    return (
        <div className="my-6 flex flex-col items-center">
            <h3 className="text-lg font-bold">{children}</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {interestedNames[level] &&
                    interestedNames[level].map((user, index) => {
                        return <User key={index} user={user} />;
                    })}
            </div>
        </div>
    );
};

function id() {
    const [admin, setAdmin] = useState(false)
    const router = useRouter();
    const [interestedNames, setInterestedNames] = useState({
        willing: [],
        interest: [],
        high: [],
    });
    const [modal, setModal] = useState(false);
    const [session, setSession] = useState(null);
    const committee = router.query;

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
		const setAuthSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (!error) {
				setSession(data);
			} else {
				console.error(error);
			}
		};
		setAuthSession();
    }, [router]);

	async function getAdminStatus(email) {
		let { data: profiles, error } = await supabase
			.from('profiles')
			.select('*')
			.eq("email", email)
		if (profiles[0]) {
			console.log(profiles[0].admin)
			setAdmin(profiles[0].admin)
		}
	}

    useEffect(() => {
        let email = session?.session.user.email
        console.log(email)
        getAdminStatus(email)
    
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
                    <Button className="w-10 mx-auto" onClick={() => setModal(true)}>
                        Edit Committee
                    </Button>
                 ) : (
                    <></>
                )}
            </div>
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
