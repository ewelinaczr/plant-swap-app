import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react";
// TOASTYFY
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// COMPONENTS
import Nav from "./components/nav/Nav";
import SignUp from "./components/signUp/SignUp";
import PlantShop from "./components/plants-shop/plants-shop";
import Profile from "./components/profile/Profile";
import AddPlant from "./components/addPland/AddPlant";
import LogIn from "./components/log-in/LogIn";
import PrivateRoute from "./components/PrivateRoute";
import Contact from "./components/contact/Contact";
import Details from "./components/details/Details";
import Favourites from "./components/favourites/Favourites";
// CONTEXT
import { FavProvider } from "./context/FavContext";

function App() {
	return (
		<Fragment>
			<BrowserRouter>
				<FavProvider>
					<Nav />
					<Routes>
						<Route path='/' element={<PlantShop />} />
						<Route path='/shop' element={<PlantShop />} />
						<Route path='/shop/:plantId' element={<Details />} />
						<Route path='/profile' element={<PrivateRoute />}>
							<Route path='/profile' element={<Profile />} />
							{/* <Route path='/profile/messages' element={<Profile />} /> */}
						</Route>
						<Route path='/add-plant' element={<AddPlant />} />
						<Route path='/log-in' element={<LogIn />} />
						<Route path='/sign-up' element={<SignUp />} />
						<Route path='/contact/:ownerId' element={<Contact />} />
						<Route path='/shop/favourites' element={<Favourites />} />
					</Routes>
				</FavProvider>
			</BrowserRouter>
			<ToastContainer />
		</Fragment>
	);
}

export default App;
