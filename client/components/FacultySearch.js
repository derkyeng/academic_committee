import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import User from "./User";
import styles from "./FacultySearch.module.css";
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
    const [committees, setCommittees] = useState([]);

    const setInactive = async () => {
        let confirmation = confirm(
            "Are you sure you want to set all users to inactive?"
        );
        if (confirmation) {
            const { data, error } = await supabase
                .from("faculty_profiles")
                .update({ active: false })
                .eq("admin", "false");
            if (error) {
                console.error(error);
                return;
            }
        }
    };

    const getCommittees = async () => {
        let { data: committee_data, error } = await supabase
            .from("committees")
            .select("*");
        if (error) {
            console.error(error);
            return;
        }
        committee_data.sort(compare_committees)
        console.log(committee_data)
        setCommittees(committee_data);
    };

    function compare_committees(a, b) {
        if (a.display_name < b.display_name) {
            return -1;
        } else if (a.display_name > b.display_name) {
            return 1;
        } else {
            return 0;
        }
    }

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
            let user_rank = "";
            if (user.title) {
                user_rank = user.title.toLowerCase();
            } else {
                user_rank = "no title";
            }

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
            } else if (
                query_committee &&
                user.interested_committees &&
                !user.interested_committees.includes(query_committee) 
            ) {
            } else {
                // Checks that a user is active
                if (user.active) {
                    AllProfiles.push(user);
                }
            }
        });
        setProfiles(AllProfiles);
    }

    useEffect(() => {
        getCommittees();
    }, []);
    return (
        <div className={styles.faculty_search_comp}>
            <div className={styles.info_div}>
                <h2 style={{ fontSize: 30 }}>Faculty Search</h2>
                <p>
                    Fill out the fields below In order to find faculty with
                    specific committee interests, tenure status, a particular
                    name, or other specifications.<br></br>
                    If you are not concerned with a particular field (i.e name
                    does not matter for your search), then leave the field as
                    N/A. Leaving <br></br> all fields as N/A will retrieve all
                    faculty.
                </p>
            </div>
            <Button
                className="button primary block"
                style={{ margin: 15 }}
                onClick={() => setInactive()}
            >
                Set All Users To Inactive
            </Button>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "14px",
                    marginLeft: "20px",
                }}
            >
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
                        <option value="fullProfessorTenured">
                            Full Professor
                        </option>
                        <option value="associateProfessor">
                            Associate Professor
                        </option>
                        <option value="AssistantProfessor">
                            Assistant Professor
                        </option>
                        <option value="AthleticFaculty">
                            Atheltic Faculty
                        </option>
                    </Select>
                </div>

                <div className="select-field" style={{ marginLeft: "14px" }}>
                    <Label htmlFor="committeeInterest">
                        Committee Interest
                    </Label>
                    <Select
                        id="committeeInterest"
                        type="text"
                        value={committeeInterest}
                        onChange={(event) =>
                            setCommitteeInterest(event.target.value)
                        }
                        style={{ maxWidth: 200 }}
                    >
                        <option value="">N/A</option>
                        {committees && committees.map((committee) => (
                            <option value={committee.id}>
                                {committee.display_name}
                            </option>
                        ))}
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
                    onClick={() =>
                        SearchDatabase(name, rank, committeeInterest)
                    }
                >
                    Search
                </Button>
            </div>
            {profiles &&
                profiles.map((user) => (
                    <div className={styles.user_div} key={user.key}>
                        <User user={user} key={user.key}></User>
                    </div>
                ))}
        </div>
    );
}
