import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import FacultySearch from "../../components/FacultySearch";

function dashboard() {
    return (
        <div className="container" style={{ padding: "50px 0 100px 0" }}>
            <h1 style={{ fontSize: 50 }}>Dashboard</h1>
            <FacultySearch></FacultySearch>
        </div>
    );
}

export default dashboard;
