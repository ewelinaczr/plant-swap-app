import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./Search.module.scss";
import { GoSearch } from "react-icons/go";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

function Search(props) {
	const [inputText, setInputText] = useState("");

	const inputHandler = (e) => {
		const lowerCase = e.target.value.toLowerCase();
		setInputText(lowerCase);
	};

	props.searchQuery(inputText);

	const onClick = () => {
		setInputText("");
	};

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<input
					className={styles.input}
					type='text'
					placeholder='Search plants'
					onChange={inputHandler}
					value={inputText}
				/>
				<GoSearch
					className={styles.icon}
					onClick={onClick}
					style={{ color: "white" }}
				/>
			</form>
			<div className={styles.buttondiv}>
				<Link to='/add-plant'>
					<button className={styles.button}>
						<AiOutlinePlus size={20} style={{ color: "white" }} />
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Search;
