import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { TextInput, Label, Button } from "flowbite-react";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const router = useRouter();

  return (
    <div>
      <div
        className="h-screen flex items-center justify-center"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          margin: "-25px -25px -25px -55px",
        }}
      >
        <Button
          onClick={async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: "google",
            });
            if (error) alert(error.message);
            // push to home page
            router.push("/account");
          }}
        >
          Log In with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
