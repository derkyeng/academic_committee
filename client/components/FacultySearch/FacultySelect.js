import { Label, Select } from "flowbite-react";
export default function FacultySelect({
    title,
    id,
    formData,
    handleFormChange,
    options,
}) {
    return (
        <div className="select-field">
            <Label htmlFor={id}>{title}</Label>
            <Select
                id={id}
                type="text"
                style={{ maxWidth: 200 }}
                value={formData[id] || ""}
                onChange={(event) =>
                    handleFormChange({
                        ...formData,
                        [id]: event.target.value,
                    })
                }
            >
                {options.map(({ value, label }) => (
                    <option value={value}>{label}</option>
                ))}
            </Select>
        </div>
    );
}
