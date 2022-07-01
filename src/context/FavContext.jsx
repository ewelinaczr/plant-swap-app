import { createContext, useState } from "react";

const FavContext = createContext();
// let likeArr = [];

export function FavProvider({ children }) {
	const [likeArr, setLikeArr] = useState([]);

	return (
		<FavContext.Provider value={{ likeArr, setLikeArr }}>
			{children}
		</FavContext.Provider>
	);
}

export default FavContext;
