import styles from "./plants-shop.module.scss";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
// TOASTYFY
import { toast } from "react-toastify";
// ICONS
import { AiOutlinePlus } from "react-icons/ai";
// COMPONENTS
import Spinner from "./../Spinner";
import PlantCard from "./../plant-card/plant-card";
import Search from "./../search/Search";

function PlantShop() {
	const [plants, setPlants] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastFetchedPlant, setLastFetchedPlant] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	const params = useParams();

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
					// console.log(doc.data());
					return plants.push({
						id: doc.id,
						data: doc.data(),
					});
				});

				setPlants(plants);

				const filterQuery = plants.filter((el) => {
					if (searchQuery === "") {
						return el;
					} else {
						return el.data.name.toLowerCase().includes(searchQuery);
					}
				});
				setPlants(filterQuery);

				setLoading(false);
			} catch (error) {
				toast.error("Could not fetch Plants");
			}
		};

		fetchPlants();
	}, [searchQuery]);

	const search = async (data) => {
		await data;
		setSearchQuery(data);
	};

	return (
		<Fragment>
			<Search searchQuery={search} />
			{loading ? (
				<Spinner />
			) : plants && plants.length > 0 ? (
				<Fragment>
					<main className={styles.container}>
						{plants.map((plant) => (
							<PlantCard
								plant={plant.data}
								id={plant.id}
								key={plant.id}
							
							/>
						))}
					</main>
				</Fragment>
			) : (
				<p className={styles.noplants}>No Plants. Change query or location.</p>
			)}
			<div className={styles.buttondiv}>
				<Link to='/add-plant'>
					<button className={styles.button}>
						<AiOutlinePlus size={30} style={{ color: "white" }} />
					</button>
				</Link>
			</div>
		</Fragment>
	);
}

export default PlantShop;
