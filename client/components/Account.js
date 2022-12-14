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
    ListGroup,
} from "flowbite-react";
import RSelect from "react-select";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [hamId, setHamId] = useState(null);
    const [rank, setRank] = useState(null);
    const [website, setWebsite] = useState(null);
    const [interestedCommittees, setInterestedCommittees] = useState([]);
    const [pastCommittees, setPastCommittees] = useState([]);
    const [avatar_url, setAvatarUrl] = useState(null);
    const [email, setEmail] = useState(null);
    const [options, setOptions] = useState([]);

    const getData = async () => {
        let { data: committees_data, error } = await supabase.from("committees").select("*");
        if (error) {
            console.error(error);
            return;
        }
        let voptions = committees_data.map((committee) => {
            return {
                value: committee.id,
                label: committee.display_name,
            };
        });

        setOptions(voptions);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getProfile();
        setEmail(session?.user.email);
    }, [session, options]);

    async function getCurrentUser() {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        if (!session?.user) {
            throw new Error("User not logged in");
        }

        return session.user;
    }

    const getProfileWithEmail = async ({ email, username, hamId }) => {
        let { data: profiles, error } = await supabase
            .from("faculty_profiles")
            .select()
            .eq("email", email);
        if (error) {
            console.error(error);
            return;
        }

        for (let i = 0; i < interestedCommittees.length; i++) {
            let { data: committee, error2 } = await supabase
                .from("committees")
                .select("*")
                .eq("id", interestedCommittees[i].value);
            console.log(committee);
            let members = committee[0].interested;
            if (members) {
                if (members.includes(hamId)) {
                    console.log("already in array");
                } else {
                    members.push(hamId);
                }
            } else {
                members = [hamId];
            }
            const { data: update, error } = await supabase
                .from("committees")
                .update({ interested: members })
                .eq("id", interestedCommittees[i].value);
        }

        if (profiles.length == 0) {
            console.log("create");
            createFacultyProfile({ username, hamId });
        } else {
            console.log("update");
            updateFacultyProfile({ username, hamId });
        }
    };

    // Creates a new faculty profile if one doesnt exist
    const createFacultyProfile = async ({ username, hamId }) => {
        const interestedCommitteesIds = interestedCommittees.map((committee) => {
            return committee.value;
        });
        const pastCommitteesIds = pastCommittees.map((committee) => {
            return committee.value;
        });
        const { data, error } = await supabase.from("faculty_profiles").insert([
            {
                employeeID: hamId,
                chosenfirstname: username.split(" ")[0],
                chosenlastname: username.split(" ")[username.split(" ").length - 1],
                email: session?.user.email,
                interested_committees: interestedCommitteesIds,
                past_committees: pastCommitteesIds,
                active: true,
                profiles_id: session.user.id,
            },
        ]);
    };

    // Updates an old faculty profile if it exists
    const updateFacultyProfile = async ({ username, hamId }) => {
        const interestedCommitteesIds = interestedCommittees.map((committee) => {
            return committee.value;
        });
        const pastCommitteesIds = pastCommittees.map((committee) => {
            return committee.value;
        });
        const { data, error } = await supabase
            .from("faculty_profiles")
            .update({
                employeeID: hamId,
                chosenfirstname: username.split(" ")[0],
                chosenlastname: username.split(" ")[username.split(" ").length - 1],
                email: session?.user.email,
                interested_committees: interestedCommitteesIds,
                past_committees: pastCommitteesIds,
                active: true,
                profiles_id: session.user.id,
            })
            .eq("employeeID", hamId);
    };

    async function getProfile() {
        try {
            setLoading(true);
            const user = await getCurrentUser();

            let { data, error, status } = await supabase
                .from("profiles")
                .select(
                    `username, website, avatar_url, rank, hamId, interested_committees, past_committees`
                )
                .eq("id", user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
                setRank(data.rank);
                setHamId(data.hamId);
                if (data.interested_committees && options.length > 0) {
                    const newInterestedCommittees = data.interested_committees.map((committee) => {
                        return {
                            value: committee,
                            label: options.find((option) => option.value == committee).label,
                        };
                    });
                    setInterestedCommittees(newInterestedCommittees);
                }
                if (data.past_committees && options.length > 0) {
                    const newPastCommittees = data.past_committees.map((committee) => {
                        return {
                            value: committee,
                            label: options.find((option) => option.value == committee).label,
                        };
                    });
                    setPastCommittees(newPastCommittees);
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function uploadProfilePicture(path) {
        console.log(path);
        const avatarFile = path;
        await supabase.storage.from("avatars").remove(`avatars/${session.user.id}`);
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(`avatars/${session.user.id}`, avatarFile);
        console.log(data);
        if (error) {
            console.log(error);
        }
    }

    const setCommitteeInterests = async (interests) => {
        setInterestedCommittees(interests);
        console.log(interests);
    };

    const setPastCommitteeInterests = async (interests) => {
        setPastCommittees(interests);
    };

    async function updateProfile({ username, website, avatar_url }) {
        try {
            setLoading(true);
            const user = await getCurrentUser();
            uploadProfilePicture(avatar_url);
            const interestedCommitteesIds = interestedCommittees.map((committee) => {
                return committee.value;
            });
            const pastCommitteesIds = pastCommittees.map((committee) => {
                return committee.value;
            });

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                rank,
                updated_at: new Date(),
                email: session?.user.email,
                hamId: hamId,
                interested_committees: interestedCommitteesIds,
                past_committees: pastCommitteesIds,
            };

            let { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-4">
            <div className="mt-2 ">
                <Label htmlFor="email">Email</Label>
                <TextInput id="email" type="text" value={session?.user.email} disabled />
            </div>
            <div className="mt-2">
                <Label htmlFor="username">Name</Label>
                <TextInput
                    id="username"
                    type="text"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mt-2">
                <Label htmlFor="username">Hamilton ID</Label>
                <TextInput
                    id="hamId"
                    type="text"
                    value={hamId || ""}
                    onChange={(e) => setHamId(e.target.value)}
                />
            </div>
            <div className="mt-2">
                <Label htmlFor="username">Rank</Label>
                <Select
                    id="username"
                    type="text"
                    value={rank || ""}
                    onChange={(e) => setRank(e.target.value)}
                >
                    <option value="assistant">Assistant Professor</option>
                    <option value="full">Full Professor</option>
                    <option value="athletic">Athletic Faculty</option>
                    <option value="associate">Associate Professor</option>
                </Select>
            </div>

            {/* change past committees and committee interests to select multiple options */}
            <div className="mt-2 ">
                <Label htmlFor="past committees">Past Committees</Label>
                <RSelect
                    isMulti
                    name="Interested Committees"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={options}
                    value={pastCommittees}
                    onChange={setPastCommitteeInterests}
                />
            </div>

            <div className="mt-2 ">
                <Label htmlFor="interested committees">Interested Committees</Label>
                <RSelect
                    isMulti
                    name="Interested Committees"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={options}
                    value={interestedCommittees}
                    onChange={setCommitteeInterests}
                />
            </div>
            {/* ------------------------------------------------------------------------- */}
            {/* Add current committess, not as choice but as a fixed parameter */}

            <div className="mt-2 " id="fileUpload">
                <div className="mb-2 block">
                    <Label htmlFor="profile" value="Upload Profile Picture" />
                </div>
                <FileInput
                    id="avatar"
                    name="avatar"
                    type="file"
                    onChange={(e) => {
                        setAvatarUrl(e.target?.files[0]);
                    }}
                    accept="image/png, image/jpeg"
                    helperText="A profile picture is useful to confirm your are logged into your account"
                />
            </div>

            <div className="mt-4 flex">
                <div className="pr-4">
                    <Button
                        className="button primary block"
                        onClick={() => {
                            updateProfile({ username, website, avatar_url });
                            getProfileWithEmail({ email, username, hamId });
                        }}
                        disabled={loading}
                    >
                        {loading ? "Loading ..." : "Update"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
