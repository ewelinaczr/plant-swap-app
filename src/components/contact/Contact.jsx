import React from "react";
import styles from "./Contact.module.scss";
import { useState, useEffect, Fragment } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// FIREBASE
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../../firebase.config";
// TOASTYFY
import { toast } from "react-toastify";
// COMPONENTS
import Button from "../button/button";
import { GiMonsteraLeaf } from "react-icons/gi";

function Contact() {
	const [message, setMessage] = useState("");
	const [owner, setOwner] = useState(null);
	// eslint-disable-next-line
	const [searchParams, setSearchParams] = useSearchParams();
	const params = useParams();

	useEffect(() => {
		const getOwner = async () => {
			const docRef = doc(db, "users", params.ownerId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setOwner(docSnap.data());
				console.log(docSnap.data());
			} else {
				toast.error("Could not get owner data");
			}
		};
		getOwner();
	}, [params.ownerId]);

	const onChange = (e) => {
		setMessage(e.target.value);
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1518335935020-cfd6580c1ab4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
					></img>
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<h2>Contact Plant Owner</h2>
						{owner !== null && (
							<main>
								<div className={styles.contactOwner}>
									<p>Contact {owner?.name}</p>
									{/* <img src={owner?.photoURL}></img> */}
									<form>
										<textarea
											className={styles.textarea}
											value={message}
											onChange={onChange}
											name='message'
											id='message'
											cols='30'
											rows='10'
										></textarea>
										<a
											href={`mailto:${owner.email}?Subject=${searchParams.get(
												"plantName"
											)}&body=${message}`}
										>
											<Button type='button'>Send message</Button>
										</a>
									</form>
								</div>
							</main>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default Contact;
