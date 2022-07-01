import React from "react";
import styles from "./Details.module.scss";
import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// ICONS
import { BsSun } from "react-icons/bs";
import { IoPlanetSharp, IoWaterOutline } from "react-icons/io5";
import { MdHeight } from "react-icons/md";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { BsShare } from "react-icons/bs";
// COMPONENTS
import Label from "../label/Label";
import Spinner from "../Spinner";
import Button from "./../button/button";
// FIREBASE
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./../../firebase.config";
// LEAFLET
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// SWIPER
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

function Details() {
	const [plant, setPlant] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);
	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth();

	useEffect(() => {
		const fetchPlant = async () => {
			const docRef = doc(db, "plants", params.plantId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				// console.log(docSnap.data());
				setPlant(docSnap.data());
				setLoading(false);
			}
		};

		fetchPlant();
	}, [navigate, params.plantId]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<div className={styles.mainphotobox}>
					<BsFillSuitHeartFill size={20} className={styles.heartbigscreen} />
					<Swiper
						slidesPerView={1}
						modules={[Navigation, Pagination, Scrollbar, A11y]}
						pagination={{ clickable: true }}
						navigation
						className={styles.swipercontainer}
						// scrollbar={{ draggable: true }}
					>
						{plant.imageUrls.map((url, index) => {
							return (
								<SwiperSlide key={index}>
									<div
										className={styles.swiperSlideDiv}
										style={{
											background: `url(${plant.imageUrls[index]}) center no-repeat`,
											backgroundSize: "cover",
										}}
									></div>
								</SwiperSlide>
							);
						})}
					</Swiper>
					{/* <img
						className={styles.mainphoto}
						src={plant.imageUrls[plant.imageUrls.length - 1]}
					></img> */}
				</div>
				<div className={styles.center}>
					<div className={styles.container}>
						<div className={styles.namelabel}>
							<div className={styles.nameshare}>
								<h2>{plant.name}</h2>
								<div
									className={styles.sharediv}
									onClick={() => {
										navigator.clipboard.writeText(window.location.href);
										setShareLinkCopied(true);
										setTimeout(() => {
											setShareLinkCopied(false);
										}, 2000);
									}}
								>
									<BsShare size={15} className={styles.shareicon} />
									{shareLinkCopied && (
										<p className={styles.linkcopied}>Link copied</p>
									)}
								</div>
							</div>
							<div className={styles.labels}>
								{plant.swap && <Label>give</Label>}
								{plant.give && <Label>swap</Label>}
								{plant.sell && <Label>sale</Label>}
							</div>
						</div>

						<div className={styles.card}>
							<BsFillSuitHeartFill size={20} className={styles.heart} />
							<div className={styles.swipercontainersmall}>
								<Swiper
									slidesPerView={1}
									// onSlideChange={() => console.log("slide change")}
									// onSwiper={(swiper) => console.log(swiper)}
									modules={[Navigation, Pagination, Scrollbar, A11y]}
									pagination={{ clickable: true }}
									navigation
									className={styles.photo}
									// scrollbar={{ draggable: true }}
								>
									{plant.imageUrls.map((url, index) => {
										return (
											<SwiperSlide key={index}>
												<div
													className={styles.swiperSlideDiv}
													style={{
														background: `url(${plant.imageUrls[index]}) center no-repeat`,
														backgroundSize: "cover",
													}}
												></div>
											</SwiperSlide>
										);
									})}
								</Swiper>
							</div>
						</div>
						<div className={styles.location}>
							<p className={styles.heading}>Location</p>
							<div className={styles.locationinfo}>
								<FaMapMarkerAlt />
								<p>{plant.location}</p>
							</div>
						</div>
						<div className={styles.info}>
							<p className={styles.heading}>Plant Info</p>
							<div className={styles.infogrid}>
								<div className={styles.infoblock}>
									<MdHeight size={18} />
									<p>height: {plant.height}cm</p>
								</div>
								<div className={styles.infoblock}>
									<BsSun size={18} />
									<p>sun exposition: {plant.sun}</p>
								</div>
								<div className={styles.infoblock}>
									<MdHeight size={18} rotate={90} className='fa-rotate-90' />
									<p>width: {plant.width}cm</p>
								</div>
								<div className={styles.infoblock}>
									<IoWaterOutline size={15} />
									<p>purifying: {plant.water}</p>
								</div>
							</div>
						</div>
						<div className={styles.description}>
							<p className={styles.heading}>Description</p>
							<p className={styles.desc}>{plant.description}</p>
						</div>
						{plant.sell && (
							<div className={styles.price}>
								<p className={styles.heading}>Price</p>
								<p className={styles.priceoffer}>${plant.price}</p>
							</div>
						)}
						<div className={styles.map}>
							<p className={styles.heading}>Map</p>
							<MapContainer
								style={{ height: "90%", width: "100%" }}
								center={[
									plant.geolocation.latitude,
									plant.geolocation.longitude,
								]}
								zoom={17}
								scrollWheelZoom={true}
							>
								<TileLayer
									attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url='https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}'
									accessToken={process.env.REACT_APP_LEAFLET_API_KEY}
								/>

								<Marker
									position={[
										plant.geolocation.latitude,
										plant.geolocation.longitude,
									]}
								>
									<Popup>{plant.location}</Popup>
								</Marker>
							</MapContainer>
						</div>
						<div className={styles.contact}>
							{auth.currentUser?.uid !== plant.userRef && (
								<Link to={`/contact/${plant.userRef}?plantName=${plant.name}`}>
									<Button>contact owner</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default Details;
