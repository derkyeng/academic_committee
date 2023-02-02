import React, { useEffect } from "react";
import { useRouter } from "next/router";

function id() {
	const router = useRouter();
	const user = router.query;

	return <div>{user.username}</div>;
}

export default id;
