import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import User from "./User";
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
import Link from "next/link";

export default function FacultySearch({ session }) {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [committeeInterest, setCommitteeInterest] = useState("");
  const [rank, setRank] = useState("");

  async function SearchDatabase(
    query_username = "",
    query_rank = "",
    query_committee = ""
  ) {
    let AllProfiles = [];
    query_username = query_username.trim().toLowerCase();

    let { data: profiles_data, error } = await supabase
      .from("faculty_profiles")
      .select("*");
    if (error) {
      console.error(error);
      return;
    }
    console.log(query_rank);
    profiles_data.map((user) => {
      let user_firstname = user.chosenfirstname.toLowerCase();
      let user_lastname = user.chosenlastname.toLowerCase();
      let user_rank = user.title.toLowerCase();

      if (
        query_username &&
        query_username != user_firstname &&
        query_username != user_lastname &&
        query_username != user_firstname + " " + user_lastname
      ) {
      } else if (
        query_rank == "AthleticFaculty" &&
        !user_rank.includes("coach")
      ) {
      } else if (
        query_rank == "AssistantProfessor" &&
        !user_rank.includes("assistant")
      ) {
      } else if (
        query_rank == "fullProfessorTenured" &&
        (!user_rank.includes("professor") ||
          user_rank.includes("assistant") ||
          user_rank.includes("associate"))
      ) {
      } else if (
        query_rank == "associateProfessor" &&
        !user_rank.includes("associate")
      ) {
      } else {
        AllProfiles.push(user);
      }
    });
    setProfiles(AllProfiles);
  }
  return (
    <div>
      <h2 style={{ fontSize: 30 }}>Faculty Search</h2>
      <p>
        Fill out the fields below In order to find faculty with specific
        committee interests, tenure status, a particular name, or other
        specifications.<br></br>
        If you are not concerned with a particular field (i.e name does not
        matter for your search), then leave the field as N/A. Leaving <br></br>{" "}
        all fields as N/A will retrieve all faculty.
      </p>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "14px" }}>
        <div className="select-field">
          <Label htmlFor="rank">Rank</Label>
          <Select
            id="rank"
            type="text"
            style={{ maxWidth: 200 }}
            value={rank || ""}
            onChange={(event) => setRank(event.target.value)}
          >
            <option value="">N/A</option>
            <option value="fullProfessorTenured">Full Professor</option>
            <option value="associateProfessor">Associate Professor</option>
            <option value="AssistantProfessor">Assistant Professor</option>
            <option value="AthleticFaculty">Atheltic Faculty</option>
          </Select>
        </div>

        <div className="select-field" style={{ marginLeft: "14px" }}>
          <Label htmlFor="committeeInterest">Committee Interest</Label>
          <Select
            id="committeeInterest"
            type="text"
            value={committeeInterest}
            onChange={(event) => setCommitteeInterest(event.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="">N/A</option>
            <option value="AcademicCommittee">Academic Committee</option>
            <option value="FacultyAppeals">Faculty Appeals Board</option>
          </Select>
        </div>

        <div className="input-field" style={{ marginLeft: "14px" }}>
          <form>
            <Label htmlFor="facultyName">Full Name</Label>
            <TextInput
              id="facultyName"
              type="text"
              name="name"
              value={name || ""}
              onChange={(event) => setName(event.target.value)}
              placeholder="N/A"
              style={{ minWidth: 250 }}
            />
          </form>
        </div>

        <Button
          className="button primary block"
          style={{ marginTop: 24, marginLeft: 10 }}
          onClick={() => SearchDatabase(name, rank, committeeInterest)}
        >
          Search
        </Button>
      </div>
      {profiles &&
        profiles.map((user) => <User user={user} key={user.key}></User>)}
    </div>
  );
}
