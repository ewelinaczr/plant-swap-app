import styles from "./button.module.scss";

function Button({ children }) {
	return (
		<div>
			<button className={styles.container}>{children}</button>
		</div>
	);
}

export default Button;
