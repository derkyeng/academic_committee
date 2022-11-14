import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import FacultySearch from "../components/FacultySearch";
import styles from "../styles/Home.module.css";
import { Card } from "flowbite-react";

export default function Home({ session }) {
  return (
    <div style={{ padding: "50px 0 100px 0", margin: "15px" }}>
      {session && (
        <Card>
          <FacultySearch></FacultySearch>
        </Card>
      )}
    </div>
  );
}
