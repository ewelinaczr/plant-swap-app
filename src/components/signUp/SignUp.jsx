import React from "react";
import styles from "./SignUp.module.scss";
import { Fragment, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// ICONS
import { FcGoogle } from "react-icons/fc";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineMail } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
// TOASTYFY
import { toast } from "react-toastify";
// COMPONENTS
import GoogleAuth from "../googleAuth.jsx/googleAuth";
// FIREBASE
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { db } from "./../../firebase.config";

function SignUp() {
	// show/hide password
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		repeatPassword: "",
		photoImg: "",
	});
	const { name, email, password, repeatPassword } = formData;
	// navigate
	const navigate = useNavigate();
	// handler functions
	const onChange = (e) => {
		setFormData((prSt) => ({ ...prSt, [e.target.id]: e.target.value }));
	};
	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			// create user
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			// update user
			updateProfile(auth.currentUser, {
				displayName: name,
			});
			const formDataCopy = { ...formData };
			delete formDataCopy.password;
			delete formDataCopy.repeatPassword;
			formDataCopy.timestamp = serverTimestamp();

			await setDoc(doc(db, "users", user.uid), formDataCopy);
			// after sign up redirect to home page
			navigate("/shop");
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1534754789238-6250d515412f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
					></img>
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<h2>Sign Up</h2>
						<form onSubmit={onSubmit}>
							<div className={styles.inputform}>
								<label>User name</label>
								<div className={styles.inputwrapper}>
									<input
										type='text'
										// placeholder='email'
										id='name'
										value={name}
										onChange={onChange}
									/>
									<AiOutlineUser className={styles.inputicon} />
								</div>
							</div>
							<div className={styles.inputform}>
								<label>User email</label>
								<div className={styles.inputwrapper}>
									<input
										type='email'
										// placeholder='email'
										id='email'
										value={email}
										onChange={onChange}
									/>
									<AiOutlineMail className={styles.inputicon} />
								</div>
							</div>
							<div className={styles.inputform}>
								<label>User password</label>
								<div className={styles.inputwrapper}>
									<input
										type={showPassword ? "text" : "password"}
										id='password'
										// placeholder='password'
										value={password}
										onChange={onChange}
									/>
									<AiOutlineLock className={styles.inputicon} />
									<AiOutlineEye
										className={styles.inputiconeye}
										onClick={() => setShowPassword((prSt) => !prSt)}
									/>
								</div>
							</div>
							<div className={styles.inputform}>
								<label>Repeat password</label>
								<div className={styles.inputwrapper}>
									<input
										type={showPassword ? "text" : "password"}
										id='repeatPassword'
										// placeholder='password'
										value={repeatPassword}
										onChange={onChange}
									/>
									<AiOutlineLock className={styles.inputicon} />
									<AiOutlineEye
										className={styles.inputiconeye}
										onClick={() => setShowPassword((prSt) => !prSt)}
									/>
								</div>
							</div>
							<p>
								Already have an account?{" "}
								<Link
									to='/log-in'
									style={{ textDecoration: "none", color: "#3d3a43" }}
								>
									<span>LOG IN</span>
								</Link>
							</p>
							<GoogleAuth />
							<button className={styles.addPlantbtn} onSubmit={onSubmit}>
								sign up
							</button>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default SignUp;
