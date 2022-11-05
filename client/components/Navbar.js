import Link from "next/link";
import { Navbar, Button, Avatar, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const Navigationbar = ({ session }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const router = useRouter();

  async function getProfile() {
    if (session?.user) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`avatars/${session.user.id}`);
      console.log(data.publicUrl);
      setProfilePic(data.publicUrl);
      setName(session.user.user_metadata.full_name);
      setEmail(session.user.email);
    }
  }

  useEffect(() => {
    getProfile();
  }, [session]);

  return (
    <div>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand>
          <button
            onClick={() => {
              router.push("/");
            }}
          >
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Academic Committee
            </span>
          </button>
        </Navbar.Brand>
        <div style={{ display: "flex" }}>
          {!session?.user ? (
            <Navbar.Collapse>
              <Navbar.Link href="/login">Login</Navbar.Link>
            </Navbar.Collapse>
          ) : (
            <Dropdown
              label={<Avatar img={profilePic} rounded={true} />}
              arrowIcon={false}
              inline={true}
            >
              <Dropdown.Header>
                <span className="block text-sm">{name}</span>
                <span className="block truncate text-sm font-medium">
                  {email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Dashboard
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  router.push("/committees/committees");
                }}
              >
                Committees
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  router.push("/ballots");
                }}
              >
                Ballots
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  router.push("/account");
                }}
              >
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </Navbar>
    </div>
  );
};

export default Navigationbar;
