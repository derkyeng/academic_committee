import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const setAuthSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data);
      } else {
        console.error(error);
      }
    };
    setAuthSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      <Navbar session={session?.session} />
      <Component session={session?.session} {...pageProps} />
    </div>
  );
}

export default MyApp;
