import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./Search.module.scss";
import { GoSearch } from "react-icons/go";

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
		</div>
	);
}

export default Search;
