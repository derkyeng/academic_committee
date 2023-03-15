import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Navbar, Button, TextInput, Label, Card, Select, FileInput, Checkbox, ListGroup } from "flowbite-react";
import InterestedSelects from "./AccountInterestedSelects";
import RSelect from "react-select";

export default function Account({ session }) {
	const [loading, setLoading] = useState(true);
	const [comment, setComment] = useState("");
	const [deptchair, setDeptChair] = useState(null);
	const [username, setUsername] = useState(null);
	const [hamId, setHamId] = useState(null);
	const [rank, setRank] = useState(null);
	const [willingCommittees, setWillingCommittees] = useState([]);
	const [interestedCommittees, setInterestedCommittees] = useState([]);
	const [highInterestCommittees, setHighInterestCommittees] = useState([]);
	const [pastCommittees, setPastCommittees] = useState([]);
	const [currentCommittees, setCurrentCommittees] = useState([]);
	const [removeWillingCommittees, setRemoveWillingCommittees] = useState([]);
	const [removeInterestedCommittees, setRemoveInterestedCommittees] = useState([]);
	const [removeHighInterestCommittees, setRemoveHighInterestCommittees] = useState([]);
	const [removeCurrentCommittees, setRemoveCurrentCommittees] = useState([]);
	const [removePastCommittees, setRemovePastCommittees] = useState([]);
	const [avatar_url, setAvatarUrl] = useState(null);
	const [email, setEmail] = useState(null);
	const [options, setOptions] = useState([]);
	const [AccountChangeSaved, setAccountChangeSaved] = useState([]);
	const SuccessMessage = () => {
		return (
			<div
				style={{
					marginTop: "20px",
					color: "#270",
					backgroundColor: "#DFF2BF",
				}}
			>
				<p>Your profile information has been updated! Reloading...</p>
			</div>
		);
	};

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
				.select(`username, avatar_url, rank, hamId, current_committees, past_committees, interested_committees, comment`)
				.eq("id", user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setComment(data.comment);
				setUsername(data.username);
				setAvatarUrl(data.avatar_url);
				setRank(data.rank);
				setHamId(data.hamId);
				setDeptChair(data.deptchair);
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
		// Update avatar image
		await supabase.storage.from("avatars").remove(`avatars/${session.user.id}`);
		const { data, error } = await supabase.storage.from("avatars").upload(`avatars/${session.user.id}`, avatarFile);
		console.log(data);
		if (error) {
			console.log(error);
		}
		// Get public url of avatar
		const { data: image_url, error2 } = supabase.storage.from("avatars").getPublicUrl(`avatars/${session.user.id}`);
		if (error) {
			console.log(error);
		}

		// Update avatar url in user database
		const { error3 } = await supabase.from("profiles").update({ avatar_url: image_url }).eq("id", session.user.id);

		setAvatarUrl(image_url);
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

	async function updateProfile({ username, avatar_url, comment, deptchair }) {
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
				comment: comment,
				deptchair: deptchair,
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

	let updateProfileCommittees = async ({ willingCommittees, interestedCommittees, highInterestCommittees }) => {
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

	const removeCommitteeMembers = async ({ removeWillingCommittees, removeInterestedCommittees, removeHighInterestCommittees }) => {
		const user = await getCurrentUser();
		console.log("----------REMOVING---------");
		for (let i = 0; i < removeWillingCommittees.length; i++) {
			let committee = removeWillingCommittees[i];
			console.log(committee);
			let { data: willingUsersData, error } = await supabase.from("committees").select("interested_users").eq("id", committee);
			let interested = willingUsersData[0].interested_users;
			let willingUsers = interested["1"];
			let newWillingUsers = willingUsers.filter((e) => e !== user.id);
			interested["1"] = newWillingUsers;
			let { data: temp, error2 } = await supabase.from("committees").update({ interested_users: interested }).eq("id", committee);
		}
		for (let i = 0; i < removeInterestedCommittees.length; i++) {
			let committee = removeInterestedCommittees[i];
			console.log(committee);
			let { data: willingUsersData, error } = await supabase.from("committees").select("interested_users").eq("id", committee);
			let interested = willingUsersData[0].interested_users;
			let willingUsers = interested["2"];
			let newWillingUsers = willingUsers.filter((e) => e !== user.id);
			interested["2"] = newWillingUsers;
			let { data: temp, error2 } = await supabase.from("committees").update({ interested_users: interested }).eq("id", committee);
		}
		for (let i = 0; i < removeHighInterestCommittees.length; i++) {
			let committee = removeHighInterestCommittees[i];
			console.log(committee);
			let { data: willingUsersData, error } = await supabase.from("committees").select("interested_users").eq("id", committee);
			let interested = willingUsersData[0].interested_users;
			let willingUsers = interested["3"];
			let newWillingUsers = willingUsers.filter((e) => e !== user.id);
			interested["3"] = newWillingUsers;
			let { data: temp, error2 } = await supabase.from("committees").update({ interested_users: interested }).eq("id", committee);
		}
		for (let i = 0; i < removeCurrentCommittees.length; i++) {
			let committee = removeCurrentCommittees[i];
			console.log(committee);
			let { data: willingUsersData, error } = await supabase.from("committees").select("members").eq("id", committee);
			let current = willingUsersData[0].members;
			let newCurrent = current.filter((e) => e !== user.id);
			let { data: temp, error2 } = await supabase.from("committees").update({ members: newCurrent }).eq("id", committee);
		}
		for (let i = 0; i < removePastCommittees.length; i++) {
			let committee = removePastCommittees[i];
			console.log(committee);
			let { data: willingUsersData, error } = await supabase.from("committees").select("past_members").eq("id", committee);
			let past = willingUsersData[0].past_members;
			let newPast = past.filter((e) => e !== user.id);
			let { data: temp, error2 } = await supabase.from("committees").update({ past_members: newPast }).eq("id", committee);
		}
		console.log("-----------END-------------");
	};

	const updateCommitteeMembers = async ({ interestedCommittees, pastCommittees, currentCommittees, willingCommittees, highInterestCommittees }) => {
		const user = await getCurrentUser();
		console.log("UPDATING COMMITTEES TABLE");
		console.log(willingCommittees);
		for (let i = 0; i < willingCommittees.length; i++) {
			let committee = willingCommittees[i].value;
			let { data: willingData, error } = await supabase.from("committees").select("interested_users").eq("id", committee);
			let interested = willingData[0].interested_users;
			let willingUsers = interested["1"];
			if (!willingUsers.includes(user.id)) {
				willingUsers.push(user.id);
			}
			interested["1"] = willingUsers;
			let { data: willingUsersData, error2 } = await supabase.from("committees").update({ interested_users: interested }).eq("id", committee);
		}
		for (let i = 0; i < interestedCommittees.length; i++) {
			let committee = interestedCommittees[i].value;
			let { data: willingData, error } = await supabase.from("committees").select("interested_users").eq("id", committee);
			let interested = willingData[0].interested_users;
			let willingUsers = interested["2"];
			if (!willingUsers.includes(user.id)) {
				willingUsers.push(user.id);
			}
			interested["2"] = willingUsers;
			let { data: willingUsersData, error2 } = await supabase.from("committees").update({ interested_users: interested }).eq("id", committee);
		}
		for (let i = 0; i < highInterestCommittees.length; i++) {
			let committee = highInterestCommittees[i].value;
			let { data: willingData, error } = await supabase.from("committees").select("interested_users").eq("id", committee);
			let interested = willingData[0].interested_users;
			let willingUsers = interested["3"];
			if (!willingUsers.includes(user.id)) {
				willingUsers.push(user.id);
			}
			interested["3"] = willingUsers;
			let { data: willingUsersData, error2 } = await supabase.from("committees").update({ interested_users: interested }).eq("id", committee);
		}
		for (let i = 0; i < currentCommittees.length; i++) {
			let committee = currentCommittees[i].value;
			let { data: currentData, error } = await supabase.from("committees").select("members").eq("id", committee);
			let current = currentData[0].members;
			if (!current.includes(user.id)) {
				current.push(user.id);
			}
			let { data: currentUserData, error2 } = await supabase.from("committees").update({ members: current }).eq("id", committee);
		}
		for (let i = 0; i < pastCommittees.length; i++) {
			let committee = pastCommittees[i].value;
			let { data: pastData, error } = await supabase.from("committees").select("past_members").eq("id", committee);
			let past = pastData[0].past_members;
			if (!past.includes(user.id)) {
				past.push(user.id);
			}
			let { data: pastUserData, error2 } = await supabase.from("committees").update({ past_members: past }).eq("id", committee);
		}
	};

	const updateChair = () => {
		setDeptChair(!deptchair);
	};

	return (
		<div className="container mx-auto py-4">
			<div className="mt-2 ">
				<Label htmlFor="email">Email</Label>
				<TextInput id="email" type="text" value={session?.user.email} disabled />
			</div>
			<div className="mt-2">
				<Label htmlFor="username">Name</Label>
				<TextInput id="username" type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} />
			</div>
			<div className="mt-2">
				<Label htmlFor="username">Hamilton ID</Label>
				<TextInput id="hamId" type="text" value={hamId || ""} onChange={(e) => setHamId(e.target.value)} />
			</div>
			<div className="mt-2">
				<Label htmlFor="username">Rank</Label>
				<Select id="username" type="text" value={rank || ""} onChange={(e) => setRank(e.target.value)}>
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
					onChange={(interests) => {
						// Removal Occured
						if (interests.length < currentCommittees.length) {
							let difference = currentCommittees.filter((committee) => !interests.includes(committee));
							if (!removeCurrentCommittees.includes(difference[0].value)) {
								setRemoveCurrentCommittees((current) => [...current, difference[0].value]);
							}
						}
						setCurrentCommittees(interests);
					}}
				/>
			</div>
			<div className="mt-2 ">
				<Label htmlFor="pastcommittees">Past Committees</Label>
				<RSelect
					isMulti
					id="pastcommittees"
					name="Past Committees"
					className="basic-multi-select"
					classNamePrefix="select"
					options={options}
					value={pastCommittees}
					onChange={(interests) => {
						// Removal Occured
						if (interests.length < pastCommittees.length) {
							let difference = pastCommittees.filter((committee) => !interests.includes(committee));
							if (!removePastCommittees.includes(difference[0].value)) {
								setRemovePastCommittees((current) => [...current, difference[0].value]);
							}
						}
						setPastCommittees(interests);
					}}
				/>
			</div>

			<div>
				<input id="chair" type="checkbox" style={{ marginRight: "10px" }} onChange={updateChair} value={deptchair} />
				<Label htmlFor="chair">I will be a department or program chair next year</Label>
			</div>

			<InterestedSelects
				options={options}
				willingCommittees={willingCommittees}
				setWillingCommittees={setWillingCommittees}
				interestedCommittees={interestedCommittees}
				setInterestedCommittees={setInterestedCommittees}
				highInterestCommittees={highInterestCommittees}
				setHighInterestCommittees={setHighInterestCommittees}
				removeWillingCommittees={removeWillingCommittees}
				setRemoveWillingCommittees={setRemoveWillingCommittees}
				removeInterestedCommittees={removeInterestedCommittees}
				setRemoveInterestedCommittees={setRemoveInterestedCommittees}
				removeHighInterestCommittees={removeHighInterestCommittees}
				setRemoveHighInterestCommittees={setRemoveHighInterestCommittees}
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
			<br></br>
			<div>
				<label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					Leave any comments you may have for the Academic Council:
				</label>
				<textarea
					id="message"
					rows="4"
					class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Write your thoughts here..."
					onChange={(e) => {
						setComment(e.target.value);
					}}
					value={comment}
				></textarea>
			</div>
			<div className="mt-4 flex">
				<div className="pr-4">
					<Button
						className="button primary block"
						onClick={() => {
							updateProfile({ username, avatar_url, comment, deptchair });
							updateProfileCommittees({
								willingCommittees,
								interestedCommittees,
								highInterestCommittees,
							});
							console.log("will also update committees");
							removeCommitteeMembers({
								removeWillingCommittees,
								removeInterestedCommittees,
								removeHighInterestCommittees,
							}).then(() => {
								updateCommitteeMembers({
									interestedCommittees,
									pastCommittees,
									currentCommittees,
									willingCommittees,
									highInterestCommittees,
								});
							});

							console.log("Removing these");
							console.log(removeWillingCommittees);
							console.log(removeInterestedCommittees);
							console.log(removeHighInterestCommittees);

							setAccountChangeSaved(AccountChangeSaved.concat(<SuccessMessage />));

							if ("caches" in window) {
								caches.keys().then((names) => {
									// Delete all the cache files
									names.forEach((name) => {
										caches.delete(name);
									});
								});

								// Makes sure the page reloads. Changes are only visible after you refresh.
							}

							// window.location.reload();
						}}
						disabled={loading}
					>
						{loading ? "Loading ..." : "Update"}
					</Button>
					{AccountChangeSaved}
				</div>
			</div>
		</div>
	);
}
