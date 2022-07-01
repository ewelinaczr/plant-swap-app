import React from "react";
import styles from "./googleAuth.module.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
// ICONS
import { FcGoogle } from "react-icons/fc";
// TOASTYFY
import { toast } from "react-toastify";
// FIREBASE
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./../../firebase.config";

export default function GoogleAuth() {
	const navigate = useNavigate();
	const location = useLocation();
	const onGoogleClick = async () => {
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			// Check if user already exists in firestore
			// if not add user
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);
			// If user, doesn't exist, create user in db
			if (!docSnap.exists()) {
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			// if succsess navigate to shop
			navigate("/");
		} catch (error) {
			toast.error("Could not authorize with Google");
		}
	};

	return (
		<div className={styles.googlelogin}>
			<h2>
				{location.pathname === "/sign-up" ? "Sign Up" : "Log In"} with Google
			</h2>
			<FcGoogle className={styles.google} size={30} onClick={onGoogleClick} />
		</div>
	);
}
