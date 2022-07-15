import React from "react";
import styles from "./EditPlant.module.scss";
import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// FIREBASE
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./../../firebase.config";
// ICONS
import { BsCurrencyDollar } from "react-icons/bs";
// COMPONENTS
import Spinner from "./../Spinner";
import Button from "../button/button";
// TOASTYFY
import { toast } from "react-toastify";
// ID
import { v4 as uuidv4 } from "uuid";

function EditPlant() {
	const params = useParams();
	const [plant, setPlant] = useState(false);
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		address: "",
		description: "",
		latitude: 0,
		longitude: 0,
		give: false,
		height: "",
		imgUrls: {},
		name: "",
		price: "",
		sell: false,
		sun: "",
		swap: false,
		timestamp: "",
		userRef: null,
		water: "",
		width: "",
	});

	const {
		address = "warsaw",
		description,
		give,
		latitude,
		longitude,
		height,
		width,
		imgUrls,
		name,
		price,
		sell,
		sun,
		swap,
		timestamp,
		userRef,
		water,
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();
	const isMounted = useRef(true);

	// Fetch plant to edit
	useEffect(() => {
		setLoading(true);
		const fetchPlant = async () => {
			const docRef = doc(db, "plants", params.plantId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setPlant(docSnap.data());
				setFormData({ ...docSnap.data(), address: docSnap.data().location });
				setLoading(false);
			} else {
				navigate("/");
				toast.error("Plant deos not exist.");
			}
		};
		fetchPlant();
	}, [navigate, params.plantId]);
	console.log(plant);

	// Redirect if plant is not users
	useEffect(() => {
		if (plant && plant.useRef !== auth.currentUser.uid) {
			toast.error("You can not edit that plant");
			navigate("/");
		}
	}, []);

	// Sets userRef to logged in user
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid });
				} else {
					navigate("/log-in");
				}
			});
		}
		return () => {
			isMounted.current = false;
		};
	}, [isMounted, auth, navigate]);

	// Form submit
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (imgUrls.length > 6) {
			toast.error("You can upload maximum 6 photos.");
			return;
		}
		// Geolocation setting
		let geolocation = {};
		let location;

		if (geolocationEnabled) {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
			);
			const data = await response.json();
			console.log(data);

			geolocation.latitude = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.longitude = data.results[0]?.geometry.location.lng ?? 0;

			location =
				data.status === "ZERO_RESULTS"
					? undefined
					: data.results[0]?.formatted_address;
			if (location === undefined || location.includes("undefined")) {
				setLoading(false);
				toast.error("Please enter a correct address");
				return;
			}
		} else {
			geolocation.latitude = latitude;
			geolocation.longitude = longitude;
			// location = address;
		}

		// Store images in firebase
		const storeImage = async (image) => {
			return new Promise((res, rej) => {
				// initialize storage
				const storage = getStorage();
				// create file name
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, "images/" + fileName);
				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
							default:
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						rej(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							res(downloadURL);
							console.log("File available at", downloadURL);
						});
					}
				);
			});
		};

		const imageUrls = await Promise.all(
			[...imgUrls].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false);
			toast.error("Images not uploaded");
			return;
		});
		// Object to submit to database
		const formDataCopy = {
			...formData,
			imageUrls,
			geolocation,
			timestamp: serverTimestamp(),
		};
		formDataCopy.location = address;
		// delete info that was overwritem
		delete formDataCopy.imgUrls;
		delete formDataCopy.address;
		// location && (formDataCopy.location = location);
		// Update listing
		console.log(params.plantId);
		// const docRef = await addDoc(collection(db, "listings"), formDataCopy);
		const docRef = doc(db, "plants", params.plantId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
		console.log(docRef);
		console.log(formDataCopy);
		await updateDoc(docRef, formDataCopy);
		console.log(formDataCopy);
		setLoading(false);
		toast.success("Plant saved");
		// Navigate to the created plant
		// navigate(`/category/${formDataCopy.type}/${docRef.id}`);
		navigate(`/shop`);
	};

	// Inputs buttons on mutate
	const onMutate = (e) => {
		let boolean = null;
		if (e.target.value === "true") {
			boolean = true;
		}
		if (e.target.value === "false") {
			boolean = false;
		}
		// Files
		if (e.target.files) {
			setFormData((prevSt) => ({ ...prevSt, imgUrls: e.target.files }));
		}
		// Text/Booleans/Numbers
		if (!e.target.files) {
			setFormData((prevSt) => ({
				...prevSt,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	};

	// Loading spinner
	if (loading) {
		return <Spinner />;
	}

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1637311252429-634d760e08b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=805&q=80'
					></img>
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<h2>Edit your Plant</h2>
						<form onSubmit={onSubmit}>
							<div className={styles.inputform}>
								<label>Plant name</label>
								<input type='text' value={name} onChange={onMutate} id='name' />
							</div>
							<div className={styles.category}>
								<button
									type='button'
									id='swap'
									value={swap}
									onClick={onMutate}
									className={swap ? styles.active : styles.btn}
								>
									Swap
								</button>
								<button
									className={give ? styles.active : styles.btn}
									type='button'
									id='give'
									value={give}
									onClick={onMutate}
								>
									Giwe away
								</button>
								<button
									type='button'
									id='sell'
									value={sell}
									onClick={onMutate}
									className={sell ? styles.active : styles.btn}
								>
									Sell
								</button>
							</div>
							{sell && (
								<div className={styles.inputform}>
									<label>Price</label>
									<div className={styles.priceform}>
										<BsCurrencyDollar className={styles.priceicon} />
										<input
											type='number'
											value={price}
											onChange={onMutate}
											id='price'
											min='1'
										/>
									</div>
								</div>
							)}
							<div className={styles.inputform}>
								<label>Pick up location</label>
								<input
									type='text'
									value={address}
									onChange={onMutate}
									id='address'
								/>
							</div>

							<div className={styles.formgrid}>
								<div className={styles.inputform}>
									<label>Plant height</label>
									<div className={styles.priceform}>
										<p className={styles.priceicon}>cm</p>
										<input
											type='text'
											value={height}
											onChange={onMutate}
											id='height'
										/>
									</div>
								</div>
								<div className={styles.inputform}>
									<label>Plant width</label>
									<div className={styles.priceform}>
										<p className={styles.priceicon}>cm</p>
										<input
											type='text'
											value={width}
											onChange={onMutate}
											id='width'
										/>
									</div>
								</div>
							</div>
							<div className={styles.formgrid}>
								<div className={styles.inputform}>
									<label>Sun</label>
									<select onChange={onMutate} id='sun'>
										<option value='full'>full</option>
										<option value='half'>half</option>
										<option value='shade'>shade</option>
									</select>
								</div>
								<div className={styles.inputform}>
									<label>Watering</label>
									<select onChange={onMutate} id='water'>
										<option value='2x /week'>2x /week</option>
										<option value='1x /week'>1x /week</option>
										<option value='1x /2weeks'>1x /2weeks</option>
										<option value='1x /month'>1x /month</option>
									</select>
								</div>
							</div>

							<div className={styles.inputform}>
								<label>Short description</label>
								<textarea
									rows='4'
									cols='50'
									className={styles.textarea}
									type='text'
									id='description'
									value={description}
									onChange={onMutate}
								/>
							</div>
							<div className={styles.inputform}>
								<label>Add Plant photos</label>
								<div className={styles.addphotosbox}>
									<input
										type='file'
										id='imgUrls'
										onChange={onMutate}
										max='6'
										min='1'
										accept='.jpg,.png,.jpeg,.avif'
										multiple
										required
									/>
								</div>
							</div>
							<Button type='submit'>edit Plant</Button>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default EditPlant;
