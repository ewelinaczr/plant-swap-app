import React from "react";
import styles from "./LogIn.module.scss";
import { Fragment, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// ICONES
import { FcGoogle } from "react-icons/fc";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineMail } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
// TOASTYFY
import { toast } from "react-toastify";
// COMPONENTS
import GoogleAuth from "../googleAuth.jsx/googleAuth";
import Button from "../button/button";
// FIREBASE
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./../../firebase.config";

function LogIn() {
	// show/hide password
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
	// navigate
	const navigate = useNavigate();
	// handler functions
	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				navigate("/");
			}
		} catch (error) {
			toast.error("Bad user credentials");
		}
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1565626606093-2e6afaa6e6f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
					></img>
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<h2>Log In</h2>
						<form onSubmit={onSubmit}>
							<div className={styles.inputform}>
								<label>User email</label>
								<div className={styles.inputwrapper}>
									<input
										type='email'
										className='emailInput'
										placeholder='Email'
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
										className='passwordInput'
										placeholder='Password'
										id='password'
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
							<p>
								Don't have an account?{" "}
								<Link
									to='/sign-up'
									style={{ textDecoration: "none", color: "#3d3a43" }}
								>
									<span>SIGN UP</span>
								</Link>
							</p>
							<GoogleAuth />
							<Button>log in</Button>
						</form>
					</div>
				</div>
			</div>
			{/* POMOC */}
			{/* <div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1588696770539-4c00a6166581?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
					></img>
				</div>
				<div className={styles.center}>
				// WYMAINA
					<div className={styles.container}>
					
						<h2>Log In</h2>

						<form onSubmit={onSubmit}>
							
							<div className={styles.inputform}>
								<label>User email</label>
								<div className={styles.inputwrapper}>
									<input
										type='email'
										className='emailInput'
										placeholder='Email'
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
										className='passwordInput'
										placeholder='Password'
										id='password'
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
							
						</form>
						<p>
							Don't have an account?{" "}
							<Link
								to='/sign-up'
								style={{ textDecoration: "none", color: "#3d3a43" }}
							>
								<span>SIGN UP</span>
							</Link>
						</p>

						<div className={styles.googlelogin}>
							<h2>Log In with Google</h2>

							<FcGoogle className={styles.google} size={30} />
						</div>
						
						<button className={styles.addPlantbtn}>log in</button>
					</div>
			
				</div>
			</div> */}
		</Fragment>
	);
}

export default LogIn;
