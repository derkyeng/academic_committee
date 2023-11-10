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
import SuccessMessage from "./SuccessMessage";

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

    const updateProfileCommittees = async (e) => {
        e.preventDefault();
        const newInterestLevels = handleInterestLevelsChange();

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
        setShowSuccess(true);
        // return data;
    };

    const handleInterestLevelsChange = () => {
        let newInterestLevels = { ...interestLevelsState };
        for (let key in newInterestLevels) {
            newInterestLevels[key] = newInterestLevels[key].filter(
                (id) => id !== committee.id
            );
        }

        if (interestLevel !== "Not Interested in Serving") {
            newInterestLevels[interestLevelsToKey[interestLevel]].push(
                committee.id
            );
        }
        setInterestLevelsState(newInterestLevels);
        return newInterestLevels;
    };

		if (interestLevel !== "Not Interested in Serving") {
			newInterestLevels[interestLevelsToKey[interestLevel]].push(
				committee.id
			);
		}
		setInterestLevelsState(newInterestLevels);
		return newInterestLevels;
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
					<form
						className={styles.right_section}
						onSubmit={updateProfileCommittees}
					>
						<h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
							Interested in {committee.display_name}?
						</h3>
						<div className="flex items-center gap-2">
							<Radio
								id="willing"
								name="interest"
								value="Willing to Serve"
								checked={interestLevel === "Willing to Serve"}
								onChange={(e) =>
									setInterestLevel(e.target.value)
								}
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
								onChange={(e) =>
									setInterestLevel(e.target.value)
								}
							/>
							<div>
								Interested to Serve
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Radio
								id="highInt"
								name="interest"
								value="High Interest to Serve"
								checked={
									interestLevel === "High Interest to Serve"
								}
								onChange={(e) =>
									setInterestLevel(e.target.value)
								}
							/>
							<div>
								High Interest in Serving
							</div>
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
								onChange={(e) =>
									setInterestLevel(e.target.value)
								}
							/>
							<div>Not Interested</div>
						</div>
						<Button
							className={styles.submitButton}
							type="submit"
							// onClick={updateProfileCommittees}
						>
							Submit
						</Button>
						{showSuccess && <SuccessMessage />}
					</form>
				</div>
			</Card>
		</div>
	);


export default Committee;
