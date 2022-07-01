import styles from "./Nav.module.scss";
import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
// ICONS
import { GiMonsteraLeaf } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";

function Nav() {
	// Nav change due to viewport width
	const navigate = useNavigate();
	const location = useLocation();
	const pathMatchRoute = (route) => {
		if (route === location.pathname) {
			return true;
		}
	};

	const [showLinks, setShowLinks] = useState(true);
	const hidden = styles.hidden;
	const toggleNavHandler = () => {
		// console.log("click");
		setShowLinks((prSt) => !prSt);
	};

	return (
		<div className={styles.container}>
			<Link to='/' style={{ textDecoration: "none", color: "#3d3a43" }}>
				<div className={styles.logobar}>
					<GiMonsteraLeaf className={styles.logo} />
					<h2>PlantSwapp</h2>
				</div>
			</Link>
			<div
				className={styles.linksbar}
				id={showLinks ? hidden : ""}
				onClick={toggleNavHandler}
			>
				<p className={styles.link} onClick={() => navigate("/shop")}>
					Shop
				</p>
				<p className={styles.link} onClick={() => navigate("/add-plant")}>
					Add plant
				</p>
				<p className={styles.link} onClick={() => navigate("/log-in")}>
					Log in
				</p>
				<p className={styles.link} onClick={() => navigate("/profile")}>
					Profile
				</p>

				<p className={styles.link} onClick={() => navigate("/shop/favourites")}>
					Favourites
				</p>
			</div>
			<AiOutlineMenu
				size={25}
				className={styles.menu}
				onClick={toggleNavHandler}
			/>
		</div>
	);
}

export default Nav;
