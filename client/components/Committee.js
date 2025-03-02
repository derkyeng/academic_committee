import React from "react";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import styles from "./Committee.module.css";
import EditCommitteeModal from "../components/CommitteesDisplay/EditCommitteeModal";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import { Radio } from "flowbite-react";
import getCurrentUser from "../utils/getCurrentUser";
import { SuccessMessage, WarningMessage } from "./Message";

const interestLevelsToKey = {
    "Willing to Serve": "1",
    "Interested to Serve": "2",
    "High Interest to Serve": "3",
};

function Committee({ committee, key, curSession, curAdmin }) {
    const [modal, setModal] = useState(false);
    const [user, setUser] = useState(curSession.session.user);
    const [admin, setAdmin] = useState(curAdmin);
    const [interestLevel, setInterestLevel] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [interestLevelsState, setInterestLevelsState] = useState(null);
    const stringifyCommittee = {
        ...committee,
        interested_users: JSON.stringify(committee.interested_users),
    };

    function setInterestLevelFromData(interestLevels, committeeId) {
        let tempInterestLevel = null;
        for (let key in interestLevels) {
            if (interestLevels[key].includes(committeeId)) {
                switch (key) {
                    case "1":
                        tempInterestLevel = "Willing to Serve";
                        break;
                    case "2":
                        tempInterestLevel = "Interested to Serve";
                        break;
                    case "3":
                        tempInterestLevel = "High Interest to Serve";
                        break;
                }
            }
        }

        if (tempInterestLevel === null) {
            setInterestLevel("Not Interested in Serving");
        } else {
            setInterestLevel(tempInterestLevel);
        }

        setInterestLevelsState(interestLevels);
    }

    useEffect(() => {
        // console.log("USER here", user);
        async function getInterestedCommittees() {
            const { data, error, status } = await supabase
                .from("profiles")
                .select("interested_committees")
                .eq("id", curSession.session.user.id);

            if (error && status !== 406) {
                throw error;
            } else {
                setInterestLevelFromData(
                    data[0].interested_committees,
                    committee.id
                );
            }
        }
        getInterestedCommittees();
    }, []);

    const updateProfileCommittees = async (newValue) => {
        const newInterestLevels = await handleInterestLevelsChange(newValue);
        // we want to add the committee id from newValue into the newInterestLevels obj

        console.log("newInterestLevels", newInterestLevels);
        const { data, error } = await supabase
            .from("profiles")
            .update({ interested_committees: newInterestLevels })
            .eq("id", user.id);

        if (error) {
            console.log(error);
            return;
        } else {
            console.log("DATA", data);
        }
        await handleInterestUsersInCommittee(newValue);

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
        // return data;
    };

    const handleInterestLevelsChange = async (newInterestLevel) => {
        const { data, error, status } = await supabase
            .from("profiles")
            .select("interested_committees")
            .eq("id", curSession.session.user.id);

        if (error && status !== 406) {
            throw error;
        }

        let newInterestLevels = data[0].interested_committees;
        console.log("TEST", newInterestLevels);
        console.log("interestLevel in handleChange", newInterestLevel);
        for (let key in newInterestLevels) {
            newInterestLevels[key] = newInterestLevels[key].filter(
                (id) => id !== committee.id
            );
        }

        if (newInterestLevel !== "Not Interested in Serving") {
            newInterestLevels[interestLevelsToKey[newInterestLevel]].push(
                committee.id
            );
        }
        setInterestLevelsState(newInterestLevels);
        return newInterestLevels;
    };

    const getInterestedUsersFromCommittees = async () => {
        const { data, error } = await supabase
            .from("committees")
            .select("interested_users")
            .eq("id", committee.id);

        if (error) {
            console.log(error);
            return;
        } else {
            return data;
        }
    };

    const handleInterestUsersInCommittee = async (newInterestLevel) => {
        let interestedUsers = await getInterestedUsersFromCommittees();

        for (let key in interestedUsers[0]["interested_users"]) {
            interestedUsers[0]["interested_users"][key] = interestedUsers[0][
                "interested_users"
            ][key].filter((id) => id !== user.id);
        }
        // console.log(
        //     "K here",
        //     user.id,
        //     interestedUsers[0]["interested_users"],
        //     newInterestLevel,
        //     interestLevelsToKey[newInterestLevel]
        // );
        if (newInterestLevel !== "Not Interested in Serving") {
            let key = interestLevelsToKey[newInterestLevel];
            interestedUsers[0]["interested_users"][key].push(user.id);
        }

        console.log("K new", interestedUsers[0]["interested_users"]);

        const { data, error } = await supabase
            .from("committees")
            .update({
                interested_users: interestedUsers[0]["interested_users"],
            })
            .eq("id", committee.id);

        if (error) {
            console.log(error);
            return;
        } else {
            console.log("NEW DATA", data);
        }
    };

    const onFormUpdate = async (e) => {
        console.log("format of e", e.target.value);
        setInterestLevel(e.target.value);
        await updateProfileCommittees(e.target.value);
    };

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
                    <form className={styles.right_section}>
                        <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                            Interested in {committee.display_name}?
                        </h3>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="willing"
                                name="interest"
                                value="Willing to Serve"
                                checked={interestLevel === "Willing to Serve"}
                                onChange={onFormUpdate}
                            />
                            <div>Willing to Serve</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="interested"
                                name="interest"
                                value="Interested to Serve"
                                checked={
                                    interestLevel === "Interested to Serve"
                                }
                                onChange={onFormUpdate}
                            />
                            <div>Interested to Serve</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="highInt"
                                name="interest"
                                value="High Interest to Serve"
                                checked={
                                    interestLevel === "High Interest to Serve"
                                }
                                onChange={onFormUpdate}
                            />
                            <div>High Interest in Serving</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="notInt"
                                name="interest"
                                checked={
                                    interestLevel ===
                                    "Not Interested in Serving"
                                }
                                value="Not Interested in Serving"
                                onChange={onFormUpdate}
                            />
                            <div>Not Interested</div>
                        </div>
                        {showSuccess && (
                            <div
                                style={{
                                    marginTop: "20px",
                                    color: "#270",
                                    backgroundColor: "#DFF2BF",
                                }}
                            >
                                <p>
                                    Your profile information has been updated!
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </Card>
        </div>
    );
}

export default Committee;
