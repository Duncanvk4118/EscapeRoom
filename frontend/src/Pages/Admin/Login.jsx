import { Link } from "react-router";

export const Login = () => {
    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-100 text-gray-800">
                <div className="flex flex-col justify-between">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold leading-tight lg:text-5xl">Login</h2>
                        <div className="text-gray-600">Heb je nog geen account?</div>
                        <Link to={"/register"} className={"text-orange-500"}>Registreer hier</Link>
                    </div>
                </div>
                <form noValidate="" className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm">E-mail</label>
                        <input id="email" type="email" placeholder="" className="w-full p-3 rounded bg-gray-200 hover:bg-white active:bg-white transition" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm">Wachtwoord</label>
                        <input id="password" type={"password"} className="resize-none w-full p-3 rounded bg-gray-200 hover:bg-white active:bg-white transition" />
                    </div>
                    <button type="submit" className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded  bg-orange-500 text-gray-50">Login</button>
                </form>
            </div>
        </div>
    )
}
