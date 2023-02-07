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
	ListGroup,
} from "flowbite-react";
import InterestedSelects from "./AccountInterestedSelects";
import RSelect from "react-select";

export default function Account({ session }) {
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState(null);
	const [hamId, setHamId] = useState(null);
	const [rank, setRank] = useState(null);
	const [willingCommittees, setWillingCommittees] = useState([]);
	const [interestedCommittees, setInterestedCommittees] = useState([]);
	const [highInterestCommittees, setHighInterestCommittees] = useState([]);
	const [pastCommittees, setPastCommittees] = useState([]);
	const [currentCommittees, setCurrentCommittees] = useState([]);
	const [avatar_url, setAvatarUrl] = useState(null);
	const [email, setEmail] = useState(null);
	const [options, setOptions] = useState([]);

	const getData = async () => {
		let { data: committees_data, error } = await supabase.from("committees").select("*");
		if (error) {
			console.error(error);
			return;
		}
		let voptions = committees_data.map((committee) => {
			return {
				value: committee.id,
				label: committee.display_name,
			};
		});

		setOptions(voptions);
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getProfile();
		setEmail(session?.user.email);
	}, [session, options]);

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
				.select(
					`username, avatar_url, rank, hamId, current_committees, past_committees, interested_committees`
				)
				.eq("id", user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
				setAvatarUrl(data.avatar_url);
				setRank(data.rank);
				setHamId(data.hamId);
				if (data.interested_committees && options.length > 0) {
					console.log(data.interested_committees["1"]);
					if (data.interested_committees["1"].length > 0) {
						let willing = data.interested_committees["1"].map((committee) => {
							return {
								value: committee,
								label: options.find((option) => option.value == committee).label,
							};
						});
						console.log(willing);
						setWillingCommittees(willing);
					}

					if (data.interested_committees["2"].length > 0) {
						let interested = data.interested_committees["2"].map((committee) => {
							return {
								value: committee,
								label: options.find((option) => option.value == committee).label,
							};
						});
						setInterestedCommittees(interested);
					}
					if (data.interested_committees["3"].length > 0) {
						let highly = data.interested_committees["3"].map((committee) => {
							return {
								value: committee,
								label: options.find((option) => option.value == committee).label,
							};
						});
						setHighInterestCommittees(highly);
					}
				}
				if (data.past_committees && options.length > 0) {
					if (data.past_committees.length > 0) {
						const newPastCommittees = data.past_committees.map((committee) => {
							return {
								value: committee,
								label: options.find((option) => option.value == committee).label,
							};
						});
						setPastCommittees(newPastCommittees);
					}
				}
				if (data.current_committees && options.length > 0) {
					if (data.current_committees.length > 0) {
						const newCommittees = data.current_committees.map((committee) => {
							return {
								value: committee,
								label: options.find((option) => option.value == committee).label,
							};
						});
						setCurrentCommittees(newCommittees);
					}
				}
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

	const setCommitteeInterests = async (interests) => {
		setInterestedCommittees(interests);
		console.log(interests);
	};

	const setPastCommitteeInterests = async (interests) => {
		setPastCommittees(interests);
	};

	const setCurrentCommitteeInterests = (interests) => {
		setCurrentCommittees(interests);
	};

	async function updateProfile({ username, avatar_url }) {
		try {
			setLoading(true);
			const user = await getCurrentUser();
			uploadProfilePicture(avatar_url);
			// const interestedCommitteesIds = interestedCommittees.map((committee) => {
			// 	return committee.value;
			// });
			const pastCommitteesIds = pastCommittees.map((committee) => {
				return committee.value;
			});

			const currentCommitteeIds = currentCommittees.map((committee) => {
				return committee.value;
			});

			const updates = {
				id: user.id,
				username,
				avatar_url,
				rank,
				updated_at: new Date(),
				email: session?.user.email,
				hamId: hamId,
				past_committees: pastCommitteesIds,
				current_committees: currentCommitteeIds,
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

	let updateProfileCommittees = async ({
		willingCommittees,
		interestedCommittees,
		highInterestCommittees,
	}) => {
		const user = await getCurrentUser();
		let willingCommitteesIds = willingCommittees.map((committee) => committee.value);
		let interestedCommitteesIds = interestedCommittees.map((committee) => committee.value);
		let highInterestCommitteesIds = highInterestCommittees.map((committee) => committee.value);

		let compiledInterested = {
			1: willingCommitteesIds,
			2: interestedCommitteesIds,
			3: highInterestCommitteesIds,
		};

		console.log(compiledInterested);

		let { data: interestedUsers, error } = await supabase
			.from("profiles")
			.update({ interested_committees: compiledInterested })
			.eq("id", user.id);
		if (error) {
			console.log(error);
			return;
		}
		console.log(interestedUsers);
	};

	const updateCommitteeMembers = async ({
		interestedCommittees,
		pastCommittees,
		currentCommittees,
		willingCommittees,
		highInterestCommittees,
	}) => {
		const user = await getCurrentUser();
	};

	return (
		<div className="container mx-auto py-4">
			<div className="mt-2 ">
				<Label htmlFor="email">Email</Label>
				<TextInput id="email" type="text" value={session?.user.email} disabled />
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
				<Label htmlFor="username">Hamilton ID</Label>
				<TextInput
					id="hamId"
					type="text"
					value={hamId || ""}
					onChange={(e) => setHamId(e.target.value)}
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
					<option value="associate">Associate Professor</option>
				</Select>
			</div>

			{/* change past committees and committee interests to select multiple options */}
			<div className="mt-2 ">
				<Label htmlFor="currentcommittees">Current Committees</Label>
				<RSelect
					isMulti
					id="currentcommittees "
					name="Current Committees"
					className="basic-multi-select"
					classNamePrefix="select"
					options={options}
					value={currentCommittees}
					onChange={setCurrentCommitteeInterests}
				/>
			</div>
			<div className="mt-2 ">
				<Label htmlFor="pastcommittees">Past Committees</Label>
				<RSelect
					isMulti
					id="pastcommittees"
					name="Interested Committees"
					className="basic-multi-select"
					classNamePrefix="select"
					options={options}
					value={pastCommittees}
					onChange={setPastCommitteeInterests}
				/>
			</div>

			<InterestedSelects
				options={options}
				willingCommittees={willingCommittees}
				setWillingCommittees={setWillingCommittees}
				interestedCommittees={interestedCommittees}
				setInterestedCommittees={setInterestedCommittees}
				highInterestCommittees={highInterestCommittees}
				setHighInterestCommittees={setHighInterestCommittees}
			/>

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
						onClick={() => {
							updateProfile({ username, avatar_url });
							updateProfileCommittees({
								willingCommittees,
								interestedCommittees,
								highInterestCommittees,
							});
							console.log("will also update committees");
							updateCommitteeMembers({
								interestedCommittees,
								pastCommittees,
								currentCommittees,
							});
						}}
						disabled={loading}
					>
						{loading ? "Loading ..." : "Update"}
					</Button>
				</div>
			</div>
		</div>
	);
}
