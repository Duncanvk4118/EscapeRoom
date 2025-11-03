import {useState} from "react";

export const CreateAssignment = () => {
    const [action, setAction] = useState("AR");

    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-700 text-gray-800">
                <div className="flex flex-col justify-between border-r border-gray-600">
                    <div className="space-y-2">
                        <h2 className="text-gray-100 text-4xl font-bold leading-tight lg:text-5xl">Nog geen object ingevoegd</h2>
                        <div className="text-gray-200">...</div>
                    </div>
                {/*    Object preview goes here*/}
                </div>
                <form noValidate="" className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm text-gray-200">Vraag</label>
                        <input id="name" type="text" placeholder="" className="w-full p-3 rounded bg-gray-200" />
                    </div>
                    <div>
                        <label htmlFor="description" className="text-sm text-gray-200">Omschrijving</label>
                        <textarea id="description" className="resize-none w-full p-3 rounded bg-gray-200" />
                    </div>
                    <div>
                        <label htmlFor="type" className="text-sm text-gray-200">Vraag Type</label>
                        <select id="type" className="w-full p-3 rounded bg-gray-200" onChange={(e) => setAction(e.target.value)} value={action}>
                            <option value="Multi">Meerkeuze</option>
                            <option value="Open">Open</option>
                            <option value="AR">AR</option>
                        </select>
                        {action === "AR" ?
                        <div className={"flex flex-col w-full py-4"}>
                            <label htmlFor="image" className="text-sm text-gray-200">AR Object</label>
                            <input type="file" id="3d" className="w-full p-3 rounded bg-gray-200" required />
                        </div>
                            : action === "Multi" ?
                                <div className={"flex flex-col w-full py-4"}>
                            <div className={"flex flex-col w-full pb-4"}>
                            <label htmlFor="image" className="text-md font-bold text-gray-200">Meerkeuze vraag</label>
                            <span className={"italic text-gray-200"}>Maximaal 4 antwoorden</span>
                            </div>
                            <div className={"flex flex-col gap-2 items-center w-full"}>
                                <div className={"flex flex-row gap-4 items-center w-full"}>
                                    <span className={"font-bold text-gray-200"}>A</span>
                                <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                                </div>
                                <div className={"flex flex-row gap-4 items-center w-full"}>
                                    <span className={"font-bold text-gray-200"}>B</span>
                                <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                                </div>
                                <div className={"flex flex-row gap-4 items-center w-full"}>
                                    <span className={"font-bold text-gray-200"}>C</span>
                                <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                                </div>
                                <div className={"flex flex-row gap-4 items-center w-full"}>
                                    <span className={"font-bold text-gray-200"}>D</span>
                                <input type="text" id="image" className={"border-2 border-gray-300 rounded-md p-2"}/>
                                </div>
                            </div>
                        </div> : <div className={"flex flex-col w-full py-4"}>
                                <label htmlFor="image" className="text-sm text-gray-200">Keywords</label>
                                <span className={"text-xs text-gray-200 pb-2"}>Vul hier de woorden in die in het antwoord(en) gevonden moeten worden. Splits de woorden op met een ","!</span>
                                <input type="text" id="keyword1" className="w-full p-3 rounded bg-gray-200" />
                            </div>
                            }
                        {action !== "AR" &&
                            <div className={"flex flex-col w-full py-4"}>
                                <label htmlFor="image" className="text-sm text-gray-200">Voeg een plaatje toe</label>
                                <span className={"text-xs text-gray-200 pb-2"}>Voeg een toepasselijk plaatje toe (PNG/JPEG)</span>
                                <input type="file" id="image" className="w-full p-3 rounded bg-gray-200" accept="image/png, image/jpeg" />
                            </div>}
                    </div>
                    <button type="submit" className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded  bg-orange-500 text-gray-50">Opslaan</button>
                </form>
            </div>
        </div>
    )
}


