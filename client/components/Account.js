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

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [rank, setRank] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
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

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, rank`)
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
        <Label htmlFor="past commitees">Past Committees</Label>
        <Select
          id="past_committee"
          type="text"
          // value={committee || ""}
          // onChange={(e) => setRank(e.target.value)}
        >
          <option value="academic">Academic Committee</option>
          <option value="athletic">Athletic Committee</option>
          <option value="custodial">Custodial Faculty</option>
        </Select>
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
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}
