import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function EditCommitteeForm({ handleConfirm, children, committeeId }) {
    const [isLoading, setIsLoading] = useState(false);

    const initialData = {
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState(initialData);

    const onSubmit = (event) => {
        //send request

        event.preventDefault();
        setFormData(initialData);
        handleConfirm();
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    if (!isLoading) {
        return (
            <form onSubmit={onSubmit}>{children(formData, handleChange)}</form>
        );
    } else {
        return <div>Loading</div>;
    }
}
