import React from "react";
import { useState, useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import Committee from "../../components/Committee";
import AddCommitteeBar from "../../components/CommitteesDisplay/AddCommitteeBar";
import CommitteeModal from "../../components/CommitteesDisplay/CommitteeModal";
import { useCommittees } from "../../hooks";
import { supabase } from "../../utils/supabaseClient";

function committees() {
    const [committees] = useCommittees();
    const [modal, setModal] = useState(false);
    const [session, setSession] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [interested_committees, setInterestedCommittees] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const setAuthSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error) {
                setSession(data);
            } else {
                console.error(error);
            }
        };
        setAuthSession();
    }, []);

    async function getAdminStatus(email) {
        let { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email);
        if (profiles[0]) {
            console.log(profiles[0].admin);
            setAdmin(profiles[0].admin);
        }
    }

    async function getAdminStatus(email) {
        let { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email);
        if (profiles[0]) {
            console.log(profiles[0].admin);
            setAdmin(profiles[0].admin);
        }
    }

    // function to get interested status of committees from db
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

    async function getInterestedCommittees() {
        const user = await getCurrentUser();
        let { data, error, status } = await supabase
            .from("profiles")
            .select("interested_committees")
            .eq("id", user.id);

        console.log("USERID", user);

        console.log("Interested committees", data[0].interested_committees);
        setInterestedCommittees(data[0].interested_committees);

        if (error && status !== 406) {
            throw error;
        }
    }

    useEffect(() => {
        let email = session?.session.user.email;
        console.log(email);
        getAdminStatus(email);
        getInterestedCommittees();
    }, [session]);

    // Filter committees based on search term
    const filteredCommittees = committees.filter(committee => 
        committee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        committee.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search and Add Committee Bar */}
            <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-1/2">
                    <TextInput
                        id="search"
                        type="text"
                        placeholder="Search committees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                        icon="search"
                    />
                </div>
                
                {admin && (
                    <div className="flex justify-end">
                        <Button 
                            gradientDuoTone="purpleToBlue"
                            size="lg"
                            onClick={() => setModal(true)}
                            className="px-6 py-2 font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            + Add New Committee
                        </Button>
                    </div>
                )}
            </div>

            {/* Elected Committees Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    Elected Committees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommittees.map((committee_item) => 
                        committee_item.elected && session && (
                            <Committee 
                                key={committee_item.id}
                                committee={committee_item}
                                curSession={session}
                                interestLevels={interested_committees}
                                curAdmin={admin}
                            />
                        )
                    )}
                </div>
            </section>

            {/* Appointed Committees Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    Appointed Committees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommittees.map((committee_item) => 
                        !committee_item.elected && session && (
                            <Committee 
                                key={committee_item.id}
                                committee={committee_item}
                                curSession={session}
                                interestLevels={interested_committees}
                                curAdmin={admin}
                            />
                        )
                    )}
                </div>
            </section>

            <CommitteeModal
                closeModal={() => setModal(false)}
                modal={modal}
            />
        </div>
    );
}

export default committees;
