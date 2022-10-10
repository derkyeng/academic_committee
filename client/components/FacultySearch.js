import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Navbar,
  Button,
  TextInput,
  Label,
  Card,
  Select,
  FileInput,
  Checkbox,
} from "flowbite-react";

export default function FacultySearch({ session }) {

    async function SearchDatabase(){
        console.log("Howdy");
    }

    return(
        <div>
            <h2 style={{fontSize: 40}}>Faculty Search</h2>
            <p>
                Fill out the fields below In order to find 
                faculty with specific committee interests,
                tenure status, a particular name, or other specifications.<br></br>
                If you are not concerned with a particular field (i.e name does not matter for your search),
                then leave the field as N/A. Leaving <br></br> all fields as N/A will retrieve all faculty.
            </p>
            
            <div className="select-field">
                <Label htmlFor="rank">Rank</Label>
                <Select
                id="rank"
                type="text"
                style={{maxWidth: 200}}
                >
                    <option value="NotApplicable">N/A</option>
                    <option value="fullProfessorTenured">Full Professor (tenured)</option>
                    <option value="fullProfessorNotTenured">Full Professor (not tenured)</option>
                    <option value="AssistantProfessor">Assistant Professor</option>
                    <option value="AthleticFaculty">Atheltic Faculty</option>
                </Select>
            </div>

            <div className="select-field">
                <Label htmlFor="committeeInterest">Committee Interest</Label>
                <Select
                id="committeeInterest"
                type="text"
                style={{maxWidth: 200}}
                >
                    <option value="NotApplicable">N/A</option>
                    <option value="AcademicCommittee">Academic Committee</option>
                    <option value="FacultyAppeals">Faculty Appeals Board</option>
                </Select>
            </div>

            <Button
                className="button primary block"
                onClick={() => SearchDatabase()}
            >
                Search
            </Button>
        </div>
    );
}