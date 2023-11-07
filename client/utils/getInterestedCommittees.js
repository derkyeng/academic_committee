import { supabase } from "./supabaseClient";
import getCurrentUser from "./getCurrentUser";

const getInterestedCommittees = async () => {
	const user = getCurrentUser();
	console.log(user);
};

export default getInterestedCommittees;
