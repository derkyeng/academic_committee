import Link from "next/link";
import { Navbar, Button } from "flowbite-react";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const Navigationbar = ({ session }) => {
  const router = useRouter();

  return (
    <div>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Academic Committee
          </span>
        </Navbar.Brand>
        <div style={{ display: "flex" }}>
          {!session?.user ? (
            <Navbar.Collapse>
              <Navbar.Link href="/login">Login</Navbar.Link>
            </Navbar.Collapse>
          ) : (
            <Navbar.Collapse style={{ marginTop: "9px", marginRight: "24px" }}>
              <Navbar.Link href="/">Dashboard</Navbar.Link>
              <Navbar.Link href="/">Committees</Navbar.Link>
              <Navbar.Link href="/account">Account</Navbar.Link>
            </Navbar.Collapse>
          )}
          {session?.user && (
            <Button
              size="sm"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                router.push("/");
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Navbar>
    </div>
  );
};

export default Navigationbar;
