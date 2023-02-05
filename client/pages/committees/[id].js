import React, { useEffect } from "react";
import { useRouter } from "next/router";

function id() {
	const router = useRouter();
	const committee = router.query;
	useEffect(() => {
		console.log(committee);
	}, [router]);
	return <div>{committee.display_name}</div>;
}

export default id;
