import { useState } from "react";
import { Modal, Label, TextInput, Textarea, Button } from "flowbite-react";
import AddCommitteeForm from "./AddCommitteeForm";
import styles from "./AddCommittee.module.css";

export default function CommitteeModal({ modal, closeModal }) {
	// using render props pattern to share form state among all form elements
	const [confirm, setConfirm] = useState(false);
	return (
		<Modal dismissible={true} show={modal} onClose={closeModal}>
			<Modal.Header>{confirm ? "Success!" : "Add a new committee"}</Modal.Header>
			<Modal.Body>
				{confirm ? (
					<div>
						<Button onClick={() => setConfirm(false)} className="button primary block">
							Add another committee
						</Button>
					</div>
				) : (
					<AddCommitteeForm confirm={confirm} handleConfirm={() => setConfirm(true)}>
						{(formData, handleChange) => (
							<>
								<Label htmlFor="name">Name of the Committee</Label>
								<TextInput
									value={formData["name"] || ""}
									onChange={handleChange}
									id="name"
									required={true}
									placeholder="e.g. App Development at Hamilton"
								/>
								<Label htmlFor="description">Briefly describe the committee in a few sentences</Label>
								<Textarea
									value={formData["description"] || ""}
									onChange={handleChange}
									id="description"
									rows={4}
									required={true}
									placeholder="Enter a short description here."
								/>
								<Button type="submit" className="button primary block">
									Submit
								</Button>
							</>
						)}
					</AddCommitteeForm>
				)}
			</Modal.Body>
		</Modal>
	);
}
