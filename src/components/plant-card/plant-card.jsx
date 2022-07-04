import styles from "./plant-card.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useContext } from "react";
// ICONS
import { BsSun } from "react-icons/bs";
import { IoWaterOutline } from "react-icons/io5";
import { MdHeight } from "react-icons/md";
import { AiOutlineColumnWidth } from "react-icons/ai";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
// COMPONENTS
import Label from "./../label/Label";
// CONTEXR
import FavContext from "../../context/FavContext";

let arr = [];

function PlantCard({ plant, id, onDelete }) {
	const navigate = useNavigate();
	const [favourite, setFavourite] = useState(false);
	const [favArr, setFavArr] = useState([]);
	const { setLikeArr } = useContext(FavContext);

	const addToFav = async (e) => {
		let index = arr.indexOf(id);
		if (index == -1) {
			await arr.push(id);
			setFavourite(true);
		} else {
			arr.splice(index, 1);
			setFavourite(false);
		}
		setFavArr(arr);
		setLikeArr(arr);
	};

	return (
		<div className={styles.container}>
			<div className={styles.leftpart}>
				<img
					className={styles.image}
					alt={plant.name}
					src={plant.imageUrls[0]}
					onClick={() => navigate(`/shop/${id}`)}
				/>
			</div>
			<div className={styles.rightpart}>
				<div className={styles.upperpart}>
					<div className={styles.info}>
						<div className={styles.nameheart}>
							<div className={styles.name}>{plant.name}</div>

							<BsFillSuitHeartFill
								size={22}
								className={favourite ? styles.heart : styles.darkheart}
								id={plant.id}
								onClick={addToFav}
							/>
						</div>

						<div className={styles.labels}>
							{plant.swap && <Label>swap</Label>}
							{plant.give && <Label>give</Label>}
							{plant.sell && <Label>sale</Label>}
						</div>
					</div>
				</div>
				<div className={styles.lowerpart}>
					<div className={styles.description}>
						<div className={styles.location}>
							<FaMapMarkerAlt />
							{plant.location}
						</div>
						<div className={styles.paragrid}>
							<div className={styles.iconbox}>
								<MdHeight size={18} />
								{plant.height}cm
							</div>
							<div className={styles.iconbox}>
								<BsSun size={15} />
								{plant.sun}
							</div>
							<div className={styles.iconbox}>
								<MdHeight size={18} rotate={90} className='fa-rotate-90' />
								{plant.width}cm
							</div>
							<div className={styles.iconbox}>
								<IoWaterOutline size={15} /> {plant.water}
							</div>
						</div>
					</div>
					<div className={styles.actionbox}>
						<div className={styles.action}>
							{plant.sell ? (
								<p className={styles.price}>${plant.price}</p>
							) : (
								<p> </p>
							)}
							{onDelete && (
								<AiOutlineDelete
									fill='#ff4419'
									onClick={() => onDelete(plant.id, plant.name)}
								/>
							)}
							<button
								className={styles.button}
								onClick={() => navigate(`/shop/${id}`)}
							>
								message
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlantCard;
