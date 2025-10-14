import {useState} from "react";

export const CreateAssignment = () => {
    const [action, setAction] = useState("AR");

    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-100 text-gray-800">
                <div className="flex flex-col justify-between">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold leading-tight lg:text-5xl">Nog geen object ingevoegd</h2>
                        <div className="text-gray-600">...</div>
                    </div>
                {/*    Object preview goes here*/}
                </div>
                <form noValidate="" className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm">Vraag</label>
                        <input id="name" type="text" placeholder="" className="w-full p-3 rounded bg-gray-200" />
                    </div>
                    <div>
                        <label htmlFor="description" className="text-sm">Omschrijving</label>
                        <textarea id="description" className="resize-none w-full p-3 rounded bg-gray-200" />
                    </div>
                    <div>
                        <label htmlFor="type" className="text-sm">Vraag Type</label>
                        <select id="type" className="w-full p-3 rounded bg-gray-200" onChange={(e) => setAction(e.target.value)} value={action}>
                            <option value="Multi">Meerkeuze</option>
                            <option value="AR">AR</option>
                        </select>
                        {action === "AR" ? <>
                        <label htmlFor="image" className="text-sm">AR Object</label>
                        <input type="file" id="image" className="w-full p-3 rounded bg-gray-200" />
                        </> : <>
                            <div className={"flex flex-col w-full pb-4"}>
                            <label htmlFor="image" className="text-md font-bold">Meerkeuze vraag</label>
                            <span className={"italic"}>Maximaal 4 antwoorden</span>
                            </div>
                            <div className={"flex flex-col gap-2 items-center w-full"}>
                            <div className={"flex flex-row gap-4 items-center w-full"}>
                                <span className={"font-bold"}>A</span>
                            <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                            </div><div className={"flex flex-row gap-4 items-center w-full"}>
                                <span className={"font-bold"}>B</span>
                            <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                            </div><div className={"flex flex-row gap-4 items-center w-full"}>
                                <span className={"font-bold"}>C</span>
                            <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                            </div><div className={"flex flex-row gap-4 items-center w-full"}>
                                <span className={"font-bold"}>D</span>
                            <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                            </div>
                            </div>
                        </>
                            }
                    </div>
                    <button type="submit" className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded  bg-orange-500 text-gray-50">Opslaan</button>
                </form>
            </div>
        </div>
    )
}


