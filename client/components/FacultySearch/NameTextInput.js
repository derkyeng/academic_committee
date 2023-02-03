import { TextInput, Label } from "flowbite-react";

export default function NameTextInput({ formData, handleFormChange }) {
    return (
        <div className="input-field">
            <Label htmlFor="facultyName">Full Name</Label>
            <TextInput
                id="facultyName"
                type="text"
                name="name"
                value={formData["name"] || ""}
                onChange={(event) =>
                    handleFormChange({
                        ...formData,
                        name: event.target.value,
                    })
                }
                placeholder="N/A"
                style={{ minWidth: 250 }}
            />
        </div>
    );
}
