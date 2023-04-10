import { useState, useEffect } from "react";
import EditCommitteeModal from "./CommitteesDisplay/EditCommitteeModal";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function CommitteePreview({ committee }) {
    const [modal, setModal] = useState(false);

    const stringifyCommittee = {
        ...committee,
        interested_users: JSON.stringify(committee.interested_users),
    };

    return (
        <Link
            href={{
                pathname: "/committees/" + committee.id,
                query: stringifyCommittee,
            }}
        >
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
                    {committee.display_name}
                </h1>

                <EditCommitteeModal
                    closeModal={() => setModal(false)}
                    modal={modal}
                    committeeId={committee.id}
                    committeeName={committee.display_name}
                    committeeElected={committee.elected}
                />
            </div>
        </Link>
    );
}
