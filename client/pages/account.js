import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { TextInput, Label, Button } from "flowbite-react";
import AccountView from "../components/Account";

const Account = ({ session }) => {
    const initialState = {
        email: "",
        password: "",
    };

    if (session?.user) {
        console.log(session.user.id);
    }

    const router = useRouter();

    return (
        <div>
            <AccountView session={session} />
        </div>
    );
};

export default Account;
