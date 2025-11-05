import logo from "../logo.png";
import {Link} from "react-router";
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import {MdOutlineCamera, MdOutlineClose, MdOutlineHouse} from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BsPerson } from 'react-icons/bs';
import { PiCrown } from 'react-icons/pi';
import {useAuth} from "../Context/UserContext";
import {useState} from "react";

export const Header = () => {
    const {user, logout} = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
        <header className="hidden md:block w-full bg-gray-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
                <Link to={"/"} className="flex items-center space-x-2">
                    {/*<h1 className="font-bold text-xl text-orange-600">Escape the Hell</h1>*/}
                    <img src={logo} alt="Logo" className="w-52 h-16"/>
                </Link>


                <nav className="hidden md:flex md:flex-row md:items-center md:justify-center space-x-6 font-medium text-gray-700 ">
                    <>
                        <Link to="/map" className="text-gray-100 hover:text-orange-500 transition">Map</Link>
                        <Link to="/scan" className="text-gray-100 hover:text-orange-500 transition">Scannen</Link>
                        <Link to="/leaderboard" className="text-gray-100 hover:text-orange-500 transition">Leaderboard</Link>

                        {!user ? (
                                <Link to="/login" className="text-orange-500 outline outline-orange-500 hover:text-white hover:bg-orange-500 p-2 rounded-full transition">Login</Link>
                            ):
                            <button className="text-orange-500 outline outline-orange-500 hover:text-white hover:bg-orange-500 p-2 rounded-full transition" onClick={() => {logout()}}>Uitloggen</button>
                        }
                    </>
                </nav>


                {!menuOpen ? (
                <button className="md:hidden text-gray-100 hover:text-orange-500" onClick={() => {setMenuOpen(!menuOpen)}}>
                    <GiHamburgerMenu className="w-5 h-5" />
                </button>
                ) : (
                    <button className="md:hidden text-gray-100 hover:text-orange-500" onClick={() => {setMenuOpen(!menuOpen)}}>
                        <AiOutlineClose className="w-5 h-5" />
                    </button>
                )}

            </div>

            <nav className={"md:hidden flex flex-col items-center space-y-4 p-10 " + (menuOpen ? "block" : "hidden") + " bg-gray-800 text-gray-100"}>
            <>
                <Link to="/map" className="text-gray-100 hover:text-orange-500 transition">Map</Link>
                <Link to="/scan" className="text-gray-100 hover:text-orange-500 transition">Scannen</Link>
                <Link to="/leaderboard" className="text-gray-100 hover:text-orange-500 transition">Leaderboard</Link>
                {!user ? (
                    <Link to="/login" className="text-orange-500 outline outline-orange-500 hover:text-white hover:bg-orange-500 p-2 rounded-full transition">Login</Link>

                ) : (
                    <button className="text-orange-500 outline outline-orange-500 hover:text-white hover:bg-orange-500 p-2 rounded-full transition" onClick={() => {logout()}}>Uitloggen</button>
                )}
            </>
        </nav>

        </header>
        <header className={"block md:hidden w-full bg-gray-800 shadow-sm fixed bottom-0 z-50"}>
            {user ? (
            <div className={"w-full flex flex-row items-center justify-between px-4 py-4 text-gray-100 text-xl"}>
                <Link to={"/scan"}><MdOutlineCamera /></Link>
                <Link to={"/leaderboard"}><PiCrown /></Link>
                <Link to={"/"} className={"bg-gray-100 p-2 mb-4 rounded-full text-gray-700"}><MdOutlineHouse /></Link>
                <Link to={"/team"}><HiOutlineUserGroup /></Link>
                <button onClick={() => logout()}><BsPerson /></button>
            </div>
            ) : (
                <div className={"w-full flex flex-row items-center justify-around px-4 py-4 text-gray-100 text-xl"}>
                <Link to={"/"}><MdOutlineHouse /></Link>
                    <Link to={"/login"}><BsPerson /></Link>
            </div>)}
        </header>
        </>
    )
}
