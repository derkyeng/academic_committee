import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import FacultySearch from "../components/FacultySearch";

export default function Home() {
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {/* <FacultySearch></FacultySearch> */}
    </div>
  );
}