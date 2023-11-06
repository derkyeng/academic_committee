import React from "react";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import styles from "./Committee.module.css";
import EditCommitteeModal from "../components/CommitteesDisplay/EditCommitteeModal";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import { Label, Radio } from "flowbite-react";

function Committee({ committee, interestLevels }) {
    const [modal, setModal] = useState(false);
    const [session, setSession] = useState(null);
    const [admin, setAdmin] = useState(false);

    const stringifyCommittee = {
        ...committee,
        interested_users: JSON.stringify(committee.interested_users),
    };

    useEffect(() => {
        const setAuthSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error) {
                setSession(data);
            } else {
                console.error(error);
            }
        };
        setAuthSession();
    }, []);

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

    const handleRadioChange = () => {};

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

    useEffect(() => {
        let email = session?.session.user.email;
        console.log(email);
        getAdminStatus(email);
    }, [session]);
    return (
        <div style={{ marginBottom: "30px" }}>
            <Card>
                <div className={styles.cardContainer}>
                    <div className={styles.left_section}>
                        <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
                            {committee.display_name}
                        </h1>
                        <h2>{committee.description}</h2>
                        <p>
                            This committee is{" "}
                            {committee.elected ? "Elected" : "Appointed"}
                        </p>
                        {admin ? (
                            <div>
                                <img
                                    src="/edit_icon.png"
                                    alt="edit button"
                                    className={styles.edit_button}
                                    onClick={() => setModal(true)}
                                />
                                <EditCommitteeModal
                                    closeModal={() => setModal(false)}
                                    modal={modal}
                                    committeeId={committee.id}
                                    committeeName={committee.display_name}
                                    committeeElected={committee.elected}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                        <Link
                            href={{
                                pathname: "/committees/" + committee.id,
                                query: stringifyCommittee,
                            }}
                        >
                            <Button>Visit Committee Page</Button>
                        </Link>
                    </div>
                    <div className={styles.right_section}>
                        <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                            Interested in {committee.display_name}?
                        </h3>
                        <div className="flex items-center gap-2">
                            <Radio
                                defaultChecked
                                id="willing"
                                name="interest"
                                value="Willing to Serve"
                            />
                            <Label htmlFor="willing">Willing to Serve</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="interested"
                                name="interest"
                                value="Interested to Serve"
                            />
                            <Label htmlFor="interested">
                                Interested to Serve
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                value={true}
                                checked={true}
                                onChange={handleRadioChange}
                            />
                            <Label htmlFor="highInt">
                                High Interest in Serving
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                checked={true}
                                onChange={() => console.log("true")}
                                id="notInt"
                                name="interest"
                                value="Not Interested in Serving"
                            />
                            <Label htmlFor="notInt">Not Interested</Label>
                        </div>
                        <Button className={styles.submitButton}>Submit</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Committee;
