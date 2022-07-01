import React from "react";
import styles from "./Favourites.module.scss";
import { Fragment, useContext, useState, useEffect } from "react";
// COMPONENTS
import Spinner from "./../Spinner";
import PlantCard from "./../plant-card/plant-card";
import Search from "./../search/Search";
//CONTEXT
import FavContext from "../../context/FavContext";
// TOASTYFY
import { toast } from "react-toastify";
// FIREBASE
import {
	collection,
	getDocs,
	query,
	orderBy,
	limit,
	startAfter,
} from "firebase/firestore";
import { db } from "./../../firebase.config";
let arr = [];

function Favourites() {
	const [plants, setPlants] = useState(null);
	const [favPlants, setFavPlants] = useState(null);
	const [loading, setLoading] = useState(true);
	const { setLikeArr, likeArr } = useContext(FavContext);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchPlants = async () => {
			try {
				// Get reference to the collection
				const plantsRef = collection(db, "plants");

				// Create a query
				const q = query(plantsRef, orderBy("timestamp", "desc"), limit(30));

				// Execute query
				const querySnap = await getDocs(q);

				// const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				// setLastFetchedPlant(lastVisible);

				const plants = [];

				querySnap.forEach((doc) => {
					return plants.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setPlants(plants);

				let result = await plants.filter((plant) =>
					likeArr.some((favId) => plant.id === favId)
				);

				const filterQuery = await result.filter((el) => {
					if (searchQuery === "") {
						return el;
					} else {
						return el.data.name.toLowerCase().includes(searchQuery);
					}
				});
				setFavPlants(filterQuery);

				setLoading(false);
			} catch (error) {
				toast.error("Could not fetch Plants");
			}
		};

		fetchPlants();
	}, [searchQuery, likeArr]);

	const search = async (data) => {
		await data;
		setSearchQuery(data);
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<img
						className={styles.mainphoto}
						src='https://images.unsplash.com/photo-1551893665-f843f600794e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
					></img>
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<h2>Favourites</h2>
						<Search searchQuery={search} className={styles.search} />
						{loading ? (
							<Spinner />
						) : favPlants && favPlants.length > 0 ? (
							<Fragment>
								<main className={styles.container}>
									{favPlants.map((plant) => (
										<PlantCard
											plant={plant.data}
											id={plant.id}
											key={plant.id}
										
										/>
									))}
								</main>
							</Fragment>
						) : (
							<p className={styles.noplants}>
								No Plants. Change query or location.
							</p>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default Favourites;
