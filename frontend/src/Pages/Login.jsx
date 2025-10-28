import { Link } from "react-router";
import {useState} from "react";
import {useAuth} from "../Context/UserContext";
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { LuPencil } from 'react-icons/lu';

export const LoginStudent = () => {
    const {user} = useAuth();

    const [teamCode, setTeamCode] = useState(null);
    const [teamFound, setTeamFound] = useState(false);
    const [userName, setUserName] = useState(null);

    // const checkInputs = () => {};
    // const login = async ()  => {
    //     const request = await fetch("http://localhost:8080/api/admin/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             email: email,
    //             password: password,
    //         })
    //     });
    //     const response = await request.json();
    //     console.log(response);
    //     if (response.status === 200) {
    //         localStorage.setItem("token", response.token);
    //         localStorage.setItem("user", JSON.stringify(response.user));
    //         window.location.href = "/admin";
    //     } else {
    //         alert("Fout bij inloggen");
    //     }
    // }


    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-700 text-gray-800">
                <div className="flex flex-col justify-between border-r border-gray-600 p-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-gray-100">Voer teamcode in</h2>
                        <div className="text-gray-200">Voer de gegeven teamcode in.</div>
                        <hr className={"p-4"}/>
                        <div className="text-gray-200">Bent u een bevoegde?</div>
                        <Link to={"/admin/login"} className={"text-orange-500"}>Hier inloggen</Link>
                    </div>
                </div>
                <form noValidate="" className="space-y-6 flex flex-col justify-center">
                    <div>
                        <label htmlFor="teamCode" className="text-sm text-gray-200">Team Code</label>
                        <div className={"flex flex-row gap-4 items-center w-full"}>
                            <input id="teamCode" type="text" value={teamCode} disabled={user || teamFound} placeholder={(user && "U kunt niet deelnemen aan het spel.")} onChange={(e) => setTeamCode(e.target.value)} className={"uppercase w-full p-3 rounded bg-gray-100 disabled:bg-gray-300 hover:bg-white active:bg-white transition" + (teamFound && " border-2 border-emerald-400")} />
                            {!teamFound ? (
                            <button className={"bg-orange-500 hover:bg-orange-600 p-3 rounded text-gray-100 text-2xl transition"} onClick={(e) => {
                                e.preventDefault();
                                setTeamFound(true);
                            }}><HiMiniMagnifyingGlass /></button>
                            ) : (
                                <button className={"bg-orange-500 hover:bg-orange-600 p-3 rounded text-gray-100 text-2xl transition"} onClick={(e) => {
                                e.preventDefault();
                                setTeamFound(false);
                                setUserName("");
                                setTeamCode("");
                            }}><LuPencil /></button>)}
                        </div>
                        {teamFound && <span className={"text-emerald-500"}>Team gevonden!</span>}
                    </div>
                    <div>
                        <label htmlFor="teamCode" className="text-sm text-gray-200">Gebruikers naam</label>
                        <input id="userName" type="text" value={userName} disabled={!teamFound} placeholder={(user && "U kunt niet deelnemen aan het spel.")} onChange={(e) => setUserName(e.target.value)} className={"w-full p-3 rounded bg-gray-100 disabled:bg-gray-300 hover:bg-white active:bg-white transition"} />
                    </div>
                    <button type="submit" disabled={!teamFound || !userName || (!teamFound && !userName)} className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded  bg-orange-500 text-gray-50">Aansluiten</button>
                </form>
            </div>
        </div>
    )
}
