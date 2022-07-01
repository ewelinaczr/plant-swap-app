import React from "react";
import { Fragment, useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import { useNavigate } from "react-router-dom";
// ICONS
import { AiOutlineCamera } from "react-icons/ai";
// COMPONENTS
import PlantCard from "../plant-card/plant-card";
import Button from "../button/button";
// TOASTYFY
import { toast } from "react-toastify";
// FIREBASE
import { getAuth, updateProfile } from "firebase/auth";
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from "firebase/firestore";
import { db } from "./../../firebase.config";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function Profile() {
	const auth = getAuth();
	// const storage = getStorage();
	const currentUser = auth.currentUser;
	// console.log(currentUser);
	const navigate = useNavigate();
	const [photoURL, setPhotoURL] = useState(
		"data:image/png;base64,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"
	);
	const [loading, setLoading] = useState(false);
	const [plants, setPlants] = useState(null);
	const [photo, setPhoto] = useState(null);
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});
	const { name, email } = formData;

	const onLogOut = () => {
		auth.signOut();
		navigate("/");
	};

	// Profile photo set up
	const upload = async (photo, currentUser, setLoading) => {
		const storage = getStorage();
		console.log(currentUser);
		const docRef = ref(storage, currentUser.uid);
		setLoading(true);
		const docSnap = await uploadBytes(docRef, photo);
		const phtURL = await getDownloadURL(docRef);
		setPhotoURL(phtURL);
		updateProfile(currentUser, { photoURL: phtURL });
		console.log(currentUser);
		setLoading(false);
		alert("Uploaded file!");
	};

	useEffect(() => {
		const fetchUserPlants = async () => {
			const plantsRef = collection(db, "plants");

			const q = query(
				plantsRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc")
			);

			const querySnap = await getDocs(q);

			let plantsArr = [];

			querySnap.forEach((doc) => {
				return plantsArr.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setPlants(plantsArr);
			setLoading(false);
		};
		fetchUserPlants();
	}, [auth.currentUser.uid]);

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				// Update display name in fb
				await updateProfile(auth.currentUser, {
					displayName: name,
					photoURL: photoURL,
				});

				// Update in firestore
				const userRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(userRef, {
					name,
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Could not update profile details");
		}
	};

	const onChange = (e) => {
		upload(photo, currentUser, setLoading);
		setFormData((prSt) => ({
			...prSt,
			[e.target.id]: e.target.value,
		}));
	};

	const onDelete = async (plantId) => {
		if (window.confirm("Are you sure you want to delete?")) {
			await deleteDoc(doc(db, "plants", plantId));
			const updatedPlants = plants.filter((plant) => plant.id !== plantId);
			setPlants(updatedPlants);
			toast.success("Successfully deleted plant");
		}
	};

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setPhoto(e.target.files[0]);
			console.log(e.target.files[0]);
		}
	};

	const onPhotoChange = () => {
		upload(photo, currentUser, setLoading);
		console.log("hejjj");
	};

	useEffect(() => {
		if (currentUser && currentUser.photoURL) {
			setPhotoURL(currentUser.photoURL);
		}
	}, [currentUser, currentUser.photo]);

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1603436326383-5e88ea4953b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
					></img>
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<h2>Profile</h2>
						<form className={styles.profileform}>
							<div className={styles.leftpart}>
								<div className={styles.inputform}>
									<label>User name</label>
									<input
										type='text'
										id='name'
										disabled={!changeDetails}
										value={name}
										onChange={onChange}
									/>
								</div>
								<div className={styles.inputform}>
									<label>User email</label>
									<input
										type='email'
										id='email'
										disabled={!changeDetails}
										value={email}
										onChange={onChange}
									/>
								</div>
							</div>
							<div className={styles.rightpart}>
								<div className={styles.photocontainer}>
									<img className={styles.photo} src={photoURL}></img>
									<div className={styles.photobtnscontainer}>
										<div
											className={
												changeDetails
													? styles.photobtn
													: styles.photobtndisabled
											}
										>
											<label htmlFor='files'>
												<div className={styles.buttonicon}>
													<AiOutlineCamera size={15} />
													select
												</div>
											</label>
											<input
												disabled={!changeDetails}
												onChange={handleChange}
												id='files'
												style={{ visibility: "hidden" }}
												type='file'
											/>
										</div>

										<button
											disabled={!changeDetails && (loading || !photo)}
											className={
												changeDetails
													? styles.photobtn
													: styles.photobtndisabled
											}
											onClick={onPhotoChange}
										>
											<div className={styles.buttonicon}>
												<AiOutlineCamera size={15} /> add
											</div>
										</button>
									</div>
								</div>
							</div>
						</form>
						<div className={styles.btnsbox}>
							<button onClick={onLogOut} className={styles.secbtn}>
								log out
							</button>
							<button
								onClick={() => {
									changeDetails && onSubmit();
									setChangeDetails((prevState) => !prevState);
								}}
								className={styles.secbtn}
							>
								{changeDetails ? "done" : "change profile"}
							</button>
						</div>
						<div className={styles.location}>
							<div className={styles.inputform}>
								<label>Set location/city/region to swap Plants</label>
								<input type='text' />
							</div>
						</div>
						<div className={styles.save}>
							<Button>Save</Button>
						</div>
						<div className={styles.yourplants}></div>
						{!loading && plants?.length > 0 && (
							<Fragment>
								<h2>Your Plants</h2>
								{plants.map((plant) => (
									<PlantCard
										key={plant.id}
										plant={plant.data}
										id={plant.id}
										onDelete={() => onDelete(plant.id)}
									/>
								))}
							</Fragment>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default Profile;
