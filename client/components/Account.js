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

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [hamId, setHamId] = useState(null);
  const [rank, setRank] = useState(null);
  const [website, setWebsite] = useState(null);
  const [committes, setCommittees] = useState([]);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    getProfile();
    setEmail(session?.user.email)
  }, [session]);

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

  const getProfileWithEmail = async ({email, username, hamId}) => {
    let { data: profiles, error } = await supabase
      .from('faculty_profiles')
      .select()
      .eq('email', email)
    if (error) {
      console.error(error)
      return
    }
    if (profiles.length == 0){ 
      console.log("create")
      createFacultyProfile({username, hamId})
    } else {
      console.log("update")
      updateFacultyProfile({username, hamId})
    }
  }

  const createFacultyProfile = async ({username, hamId}) => {
    const { data, error } = await supabase
    .from('faculty_profiles')
    .insert([
      { 
        employeeID: hamId,
        chosenfirstname: username.split(' ')[0],
        chosenlastname: username.split(' ')[-1],
        email: session?.user.email
       },
    ])
  }

  const updateFacultyProfile = async ({username, hamId}) => {
    const { data, error } = await supabase
      .from('faculty_profiles')
      .update({         
        employeeID: hamId,
        chosenfirstname: username.split(' ')[0],
        chosenlastname: username.split(' ')[-1],
        email: session?.user.email })
      .eq('employeeID', hamId)
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, rank, hamId`)
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

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      uploadProfilePicture(avatar_url);

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        rank,
        updated_at: new Date(),
        email: session?.user.email,
        hamId: hamId
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
        <TextInput
          id="email"
          type="text"
          value={session?.user.email}
          disabled
        />
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
        </Select>
      </div>

      {/* change past committees and committee interests to select multiple options */}
      <div className="mt-2 ">
        <Label htmlFor="past committees">Past Committees</Label>
        <ListGroup>
          <ListGroup.Item>
            <Checkbox style={{ marginRight: "12px", marginTop: "2px" }} />
            <Label pl={2}>Academic Committee</Label>
          </ListGroup.Item>
          <ListGroup.Item>
            <Checkbox style={{ marginRight: "12px", marginTop: "2px" }} />
            <Label pl={2}>Athletic Committee</Label>
          </ListGroup.Item>
          <ListGroup.Item>
            <Checkbox style={{ marginRight: "12px", marginTop: "2px" }} />
            <Label pl={2}>Custodial Faculty</Label>
          </ListGroup.Item>
        </ListGroup>
      </div>

      <div className="mt-2 ">
        <Label htmlFor="interested commitees">Interested Committees</Label>
        <Select
          id="interested_committee"
          type="text"
          // value={committee || ""}
          // onChange={(e) => setRank(e.target.value)}
        >
          <option value="academic"> Academic Committee</option>
          <option value="athletic">Athletic Committee</option>
          <option value="custodial">Custodial Faculty</option>
        </Select>
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
            }
          }
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}
