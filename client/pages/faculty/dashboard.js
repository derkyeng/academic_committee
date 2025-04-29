import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import FacultySearch from "../../components/FacultySearch";

function dashboard() {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Faculty Dashboard</h1>
                <p className="subtitle">Search and manage faculty committee assignments</p>
            </header>
            <main className="dashboard-content">
                <FacultySearch />
            </main>
            <style jsx>{`
                .dashboard-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem 4rem;
                }
                .dashboard-header {
                    margin-bottom: 2.5rem;
                    text-align: center;
                }
                .dashboard-header h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }
                .subtitle {
                    color: #718096;
                    font-size: 1.1rem;
                }
                .dashboard-content {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}

export default dashboard;
