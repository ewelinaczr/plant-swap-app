import React from "react";
import classes from "./Label.module.scss";

function Label({ children }) {
	let bgColor;
	if (children === "swap") {
		return (
			<div
				style={{ backgroundColor: "rgba(56, 86, 255, 0.3)", color: "#3856ff" }}
				className={classes.button}
			>
				{children}
			</div>
		);
	} else if (children === "give") {
		return (
			<div
				style={{
					backgroundColor: "rgba(186, 226, 199, 1)",
					color: "#0caa42",
				}}
				className={classes.button}
			>
				{children}
			</div>
		);
	} else if (children === "sale") {
		return (
			<div
				style={{
					backgroundColor: "rgba(255, 68, 25, 0.3)",
					color: "#ff4419",
				}}
				className={classes.button}
			>
				{children}
			</div>
		);
	}
}

export default Label;

// labels
// $swap: #3856ff;
// $give: #0caa42;
// $sell: #ff4419;
