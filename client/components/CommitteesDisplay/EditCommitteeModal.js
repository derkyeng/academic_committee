import { useState } from "react";
import { Modal, Label, TextInput, Textarea, Button } from "flowbite-react";
import EditCommitteeForm from "./EditCommitteeForm";
import { supabase } from "../../utils/supabaseClient";
import styles from "./AddCommittee.module.css";

export default function EditCommitteeModal({ modal, closeModal, committeeId }) {
    // using render props pattern to share form state among all form elements
    const [confirm, setConfirm] = useState(false);
    const [committeeName, setCommitteeName] = useState("");

    async function UpdateCommitteeName(name, committee_id) {
        if (name && committee_id) {
            const { error } = await supabase
            .from("committees")
            .update({ display_name: name })
            .eq('id', committee_id);
            if (error) {
                console.error(error);
                return;
            }
        }
    }

    async function UpdateCommitteeDescription(description, committee_id) {
        if (description && committee_id) {
            const { error } = await supabase
            .from("committees")
            .update({ description: description })
            .eq('id', committee_id);
            if (error) {
                console.error(error);
                return;
            }
        }
    }

    async function DeleteCommittee(committee_id) {
        if (committee_id) {
            const { error } = await supabase
            .from("committees")
            .delete()
            .eq('id', committee_id);
        }
    }

    return (
        <Modal dismissible={true} show={modal} onClose={closeModal}>
            <Modal.Header>
                {confirm ? "Success!" : "Edit Committee "}
            </Modal.Header>
            <Modal.Body>
                {confirm ? (
                    <div>
                        <Button
                            onClick={() => setConfirm(false)}
                            className="button primary block"
                        >
                            Edit another committee
                        </Button>
                    </div>
                ) : (
                    <EditCommitteeForm
                        confirm={confirm}
                        handleConfirm={() => setConfirm(true)}
                        committeeId={committeeId}
                    >
                        {(formData, handleChange) => (
                            <>
                                <Label htmlFor="name">
                                    New name of the Committee
                                </Label>
                                <TextInput
                                    value={formData["name"] || ""}
                                    onChange={handleChange}
                                    id="name"
                                    required={true}
                                    placeholder={"Current name:"+ formData["name"]}
                                />

                                <Button
                                    onClick={() => UpdateCommitteeName(formData["name"], committeeId)}
                                >
                                    Update
                                </Button>

                                <Label htmlFor="description">
                                    New description for this committee
                                </Label>
                                <Textarea
                                    value={formData["description"] || ""}
                                    onChange={handleChange}
                                    id="description"
                                    rows={4}
                                    required={true}
                                    placeholder="Enter a description here."
                                />

                                <Button
                                    onClick={() => UpdateCommitteeDescription(formData["description"], committeeId)}
                                >
                                    Update
                                </Button>

                                <Button
                                    onClick={() => DeleteCommittee(committeeId)}
                                >
                                    Delete Committee
                                </Button>
                            </>
                        )}
                    </EditCommitteeForm>
                )}
            </Modal.Body>
        </Modal>
    );
}
