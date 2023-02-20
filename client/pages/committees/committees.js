import React from "react";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Committee from "../../components/Committee";
import AddCommitteeBar from "../../components/CommitteesDisplay/AddCommitteeBar";
import CommitteeModal from "../../components/CommitteesDisplay/CommitteeModal";
import { useCommittees } from "../../hooks";
function committees() {
    const [committees] = useCommittees();

    const [modal, setModal] = useState(false);
    return (
        <div>
            <AddCommitteeBar openModal={() => setModal(true)} />
            <CommitteeModal closeModal={() => setModal(false)} modal={modal} />
            <h1 style={{fontWeight: "bold", fontSize: "35px", marginBottom: "30px"}}>Elected Committees</h1>
            {committees.length == 0
                ? "loading"
                : committees.map((committee_item) => (
                    committee_item.elected ? 
                        <Committee
                            committee={committee_item}
                            key={committee_item.id}
                        />

                    : <></>
            ))}

            <h1 style={{fontWeight: "bold", fontSize: "35px", marginBottom: "30px"}}>Appointed Committees</h1>
            {committees.length == 0
                ? "loading"
                : committees.map((committee_item) => (
                    !committee_item.elected ? 
                        <Committee
                            committee={committee_item}
                            key={committee_item.id}
                        />

                    : <></>
            ))}

        </div>
    );
}

export default committees;
