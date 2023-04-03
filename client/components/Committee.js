import React from "react";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import styles from "./Committee.module.css";
import EditCommitteeModal from "../components/CommitteesDisplay/EditCommitteeModal";
import Link from "next/link";

function Committee({ committee }) {
    const [modal, setModal] = useState(false);

    const stringifyCommittee = {
        ...committee,
        interested_users: JSON.stringify(committee.interested_users),
    };

    return (
        <div style={{ marginBottom: "30px" }}>
            <Card>
                <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
                    {committee.display_name}
                </h1>
                <h2>{committee.description}</h2>
                <p>
                    This committee is{" "}
                    {committee.elected ? "Elected" : "Appointed"}
                </p>
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
                <Link
                    href={{
                        pathname: "/committees/" + committee.id,
                        query: stringifyCommittee,
                    }}
                >
                    <Button>Visit Committee Page</Button>
                </Link>
            </Card>
        </div>
    );
}

export default Committee;
