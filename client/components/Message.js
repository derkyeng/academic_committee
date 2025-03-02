export const SuccessMessage = () => {
	return (
		<div
			style={{
				marginTop: "20px",
				color: "#270",
				backgroundColor: "#DFF2BF",
			}}
		>
			<p>
				Your profile information has been updated! Please refresh the
				page to see new changes.
			</p>
		</div>
	);
};

export const WarningMessage = () => {
	return (
		<div
			style={{
				marginTop: "20px",
				color: "#856404",
				backgroundColor: "#fff3cd",
			}}
			className="mb-4 p-4 rounded"
		>
			<p>Please update your profile with your Hamilton ID!</p>
		</div>
	);
};

