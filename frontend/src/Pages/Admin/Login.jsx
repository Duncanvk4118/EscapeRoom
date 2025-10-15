import { Link } from "react-router";
import {useState} from "react";

export const Login = () => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const checkInputs = () => {};
    const login = async ()  => {
        const request = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "",
                password: ""
            })
        });
        const response = await request.json();
        console.log(response);
        if (response.status === 200) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            window.location.href = "/admin";
        } else {
            alert("Fout bij inloggen");
        }
    }


    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-700 text-gray-800">
                <div className="flex flex-col justify-between">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-gray-100">Login</h2>
                        <div className="text-gray-200">Alleen bevoegden kunnen hier inloggen.</div>
                        {/*<div className="text-gray-200">Heb je nog geen account?</div>*/}
                        {/*<Link to={"/register"} className={"text-orange-500"}>Registreer hier</Link>*/}
                    </div>
                </div>
                <form noValidate="" className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm text-gray-200">E-mail</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="" className="w-full p-3 rounded bg-gray-200 hover:bg-white active:bg-white transition" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm text-gray-200">Wachtwoord</label>
                        <input id="password" type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} className="resize-none w-full p-3 rounded bg-gray-200 hover:bg-white active:bg-white transition" />
                    </div>
                    <button type="submit" className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded  bg-orange-500 text-gray-50">Login</button>
                </form>
            </div>
        </div>
    )
}
