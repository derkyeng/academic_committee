import React from "react";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import styles from "./Committee.module.css";
import EditCommitteeModal from "../components/CommitteesDisplay/EditCommitteeModal";
import Link from "next/link";

function Committee({ committee }) {
    const [modal, setModal] = useState(false);

    // query in nextjs only passes along a shallow level object. Need to stringify the next level object
    const stringifyCommittee = {
        ...committee,
        interested_users: JSON.stringify(committee.interested_users),
    };
    return (
        <div className="cursor-pointer">
            <Link
                href={{
                    pathname: "/committees/" + committee.id,
                    query: stringifyCommittee,
                }}
            >
                <div>
                    <Card>
                        <h1>{committee.display_name}</h1>
                        <h2>{committee.description}</h2>
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
                        />
                    </Card>
                </div>
            </Link>
        </div>
    );
}

export default Committee;
