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

export default getCurrentUser;
