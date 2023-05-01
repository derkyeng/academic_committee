import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button, Card } from "flowbite-react";

function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    document.title = "Academic Committee"
    const setAuthSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data);
      } else {
        console.error(error);
      }
    };
    setAuthSession();
  }, []);

  return (
    <div>
      <Navbar session={session?.session} />
      <Component session={session?.session} {...pageProps} />
      {/* Add buttons to go to other pages */}
    </div>
  );
}

export default MyApp;
