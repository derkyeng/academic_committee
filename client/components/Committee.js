import React from "react";
import { Card } from "flowbite-react";
import Link from "next/link";

function Committee({ committee }) {
	return (
		<div>
			<Link href={"/committees/" + committee.id}>
				<Card>
					<h1>{committee.display_name}</h1>
					<h2>{committee.description}</h2>
				</Card>
			</Link>
		</div>
	);
}

export default Committee;
