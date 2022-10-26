import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import User from "../components/User";
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
    const [profiles, setProfiles] = useState([])
    const [name, setName] = useState("")
    const [committeeInterest, setCommitteeInterest] = useState("")
    const [rank, setRank] = useState("")


    async function SearchDatabase(query_username="", query_rank="", query_committee=""){
        let AllProfiles = []
        let { data: profiles_data, error } = await supabase
            .from('profiles')
            .select('*')
        if (error) {
            console.error(error)
            return
        }
        profiles_data.map((user) => {
            if (query_username && user.username != query_username ){}
            else if (query_rank && user.rank != query_rank) {}
            else if (query_committee && user.committee != query_committee) {}
            else{
                AllProfiles.push(user)
            }

        })
        setProfiles(AllProfiles)
    }

    return(
        <div>
            <h2 style={{fontSize: 30}}>Faculty Search</h2>
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
                value={rank || ""}
                onChange={(event) => setRank(event.target.value)}
                >
                    <option value="">N/A</option>
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
                value={committeeInterest}
                onChange={(event) => setCommitteeInterest(event.target.value)}
                style={{maxWidth: 200}}
                >
                    <option value="">N/A</option>
                    <option value="AcademicCommittee">Academic Committee</option>
                    <option value="FacultyAppeals">Faculty Appeals Board</option>
                </Select>
            </div>

            <div className="input-field">
                <form>
                    <Label htmlFor="facultyName">
                        Full Name
                    </Label>
                    <input 
                        id="facultyName" 
                        type="text" 
                        name="name"
                        value={name || ""}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="N/A"
                        style={{display: "flex"}}/>
                </form>
            </div>

            <Button
                className="button primary block"
                onClick={() => SearchDatabase(name, rank, committeeInterest)}
            >
                Search
            </Button>
            {profiles.length == 0 ? 'loading' : 
                profiles.map((user) => 
                    <User user={user} key={user.key}></User>
            )}
        </div>
    );
}