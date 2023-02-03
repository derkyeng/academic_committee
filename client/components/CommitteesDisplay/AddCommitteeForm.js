import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function AddCommitteeForm({ handleConfirm, children }) {
    const [isLoading, setIsLoading] = useState(false);
    async function insertCommittee(formData) {
        const { name, description } = formData;
        setIsLoading(true);
        const { error } = await supabase
            .from("committees")
            .upsert({ display_name: name, description: description });
        setIsLoading(false);
        if (error) {
            console.error(error);
            return;
        }
    }

    const initialData = {
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState(initialData);

    const onSubmit = (event) => {
        //send request
        event.preventDefault();
        insertCommittee(formData);
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
