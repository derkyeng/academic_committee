import { useState } from "react";
import { Modal, Label, TextInput, Textarea, Button } from "flowbite-react";
import EditCommitteeForm from "./EditCommitteeForm";
import { supabase } from "../../utils/supabaseClient";
import Select from 'react-select'

export default function EditCommitteeModal({ modal, closeModal, committeeId, committeeName, committeeElected }) {
    // using render props pattern to share form state among all form elements
    const [confirm, setConfirm] = useState(false);
    const [electedChoice, setElectedChoice] = useState(null);
    const [NameChangeSaved, setNameChangeSaved] = useState([]);
    const [DescriptionChangesaved, setDescriptionChangesaved] = useState([]);
    const [electedStatusChanged, setElectedStatusChanged] = useState([]);
    const [commiteeDeleted, setCommiteeDeleted] = useState([]);


    const ElectOptions = [
        { value: true, label: 'Elected Committee' },
        { value: false, label: 'Appointed Committee' },
        { value: null, label: 'N/A' }
      ]
    const SuccessMessage = () => {
        return (
            <div style={{  
                color: "#270",
                backgroundColor: "#DFF2BF"
                }}
            >
                <p>Changes have been saved!</p>
            </div>
    );};
    const DeletedMessage = () => {
        return (
            <div style={{  
                color: "#D8000C",
                backgroundColor: "#FFBABA"
                }}
            >
                <p>Committee has been deleted.</p>
            </div>
    );};

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
        setNameChangeSaved(NameChangeSaved.concat(<SuccessMessage/>))
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
        setDescriptionChangesaved(DescriptionChangesaved.concat(<SuccessMessage/>))
    }

    async function DeleteCommittee(committee_id) {
        if (committee_id) {
            const { error } = await supabase
            .from("committees")
            .delete()
            .eq('id', committee_id);
        }
        setCommiteeDeleted(commiteeDeleted.concat(<DeletedMessage/>))
    }

    async function updateElectedStatus() {
        const { error } = await supabase
            .from('committees')
            .update({ elected: electedChoice['value'] })
            .eq('id', committeeId);
            if (error) {
                console.error(error);
                return;
            }
        setElectedStatusChanged(DescriptionChangesaved.concat(<SuccessMessage/>))
    }

    return (
        <Modal dismissible={true} show={modal} onClose={closeModal}>
            <Modal.Header>
                {confirm ? "Success!" : `Edit Details`}
            </Modal.Header>
            <Modal.Body>
                {confirm ? (
                    <div>
                        <p>Edits Complete</p>
                    </div>
                ) : (
                    <EditCommitteeForm
                        confirm={confirm}
                        handleConfirm={() => setConfirm(true)}
                        committeeId={committeeId}
                    >
                        {(formData, handleChange) => (
                            <>
                                <h1 style={{fontSize: "25px", marginBottom: "0px", marginTop: "0px"}}>
                                    {`${committeeName} Committee `}
                                </h1>
                                {committeeElected ? (
                                    <p style={{marginBottom: "15px" }}>(Elected Committee)</p>
                                ) : (
                                    <p style={{marginBottom: "15px" }}>(Appointed Committee)</p>
                                )}
                                <Label htmlFor="name">
                                    New name of the Committee
                                </Label>
                                <TextInput
                                    value={formData["name"] || ""}
                                    onChange={handleChange}
                                    id="name"
                                    required={true}
                                    placeholder={"Current name: "+ committeeName}
                                />

                                <Button
                                    onClick={() => UpdateCommitteeName(formData["name"], committeeId)}
                                    style={{ marginBottom: "30px", marginTop: "5px" }}
                                >
                                    Update
                                </Button>
                                {NameChangeSaved}

                                <Label htmlFor="description">
                                    Enter a new description for this committee
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
                                    style={{ marginBottom: "30px", marginTop: "5px" }}
                                >
                                    Update
                                </Button>
                                {DescriptionChangesaved}

                                <Label htmlFor="description">
                                    Set this committee to be marked as selected or appointed
                                </Label>
                                <Select 
                                    options={ElectOptions} 
                                    onChange={(choice) => setElectedChoice(choice)}
                                />
                                <Button
                                    onClick={() => updateElectedStatus()}
                                    style={{ marginBottom: "30px", marginTop: "5px" }}
                                >
                                    Update
                                </Button>
                                {electedStatusChanged}

                                <Button
                                    onClick={() => DeleteCommittee(committeeId)}
                                    style={{ background: "#CA2C2C", marginTop: "20px"}}
                                >
                                    Delete Committee
                                </Button>
                                {commiteeDeleted}
                            </>
                        )}
                    </EditCommitteeForm>
                )}
            </Modal.Body>
        </Modal>
    );
}
