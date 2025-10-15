import {useEffect, useState} from "react";
import {useParams} from "react-router";
import { FaRegLightbulb } from 'react-icons/fa';

export const Quest = () => {
    const quest = useParams();

    const [selectedAwnser, setSelectedAwnser] = useState(null);

    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 w-full max-w-screen-lg justify-center items-center">
                <div>
                    <div className="bg-gray-700 rounded mt-4 shadow-lg py-6">
                        <div className="px-8">
                            <div className="flex items-end">
                                <span className="text-gray-300 text-sm font-thin focus:outline-none -ml-1">
                                    Vraag {quest.questId}
                                </span>
                            </div>
                            <img src="https://cdn.pixabay.com/photo/2017/01/31/16/59/bomb-2025548_1280.png" alt="Vraag Img" className={"h-56 w-56 p-2"} />
                            <div className="flex items-end">
                            <span className="text-lg font-medium focus:outline-none -ml-1">
                                    {"Wie is het meest gevaarlijk?"}
                                </span>
                            </div>
                            <span className="text-xs text-gray-300 mt-2">Nog {"2"} hints over.</span>
                        </div>
                        <div className="grid grid-flow-col grid-cols-5 px-8 pt-4 gap-2">
                            <button
                                className="flex col-span-1 items-center justify-center disabled:bg-amber-300 bg-amber-500 text-xl font-medium w-full h-15 rounded text-blue-50 hover:bg-amber-700 active:bg-amber-800 transition">
                                <FaRegLightbulb />
                            </button>
                            <button
                                disabled={!selectedAwnser}
                                className="flex col-span-4 items-center justify-center disabled:bg-orange-300 bg-orange-500 text-sm font-medium w-full h-10 rounded text-blue-50 hover:bg-orange-700 active:bg-orange-800 transition">
                                Controleren
                            </button>
                        </div>
                        {!selectedAwnser && <div className={"flex justify-center items-center"}><span className={"text-red-500 text-sm"}>{"Er is nog geen antwoord gegeven."}</span></div>}
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h2 className="text-sm font-medium">Opties</h2>
                    <form className="bg-gray-700 rounded mt-4 shadow-lg">
                        <div className="cursor-pointer flex items-center px-8 py-5" onClick={() => setSelectedAwnser("A")}>
                            <input
                                checked={selectedAwnser === "A"}
                                className={"cursor-pointer appearance-none w-4 h-4 rounded-full border-2 border-gray-700 ring-2 ring-orange-600 ring-opacity-100" + (selectedAwnser === "A" ? " bg-orange-500" : "")}
                                type="radio"/>
                            <label className="cursor-pointer flex flex-row items-center text-sm font-medium ml-4"><span className={"cursor-pointer font-bold text-lg px-2"}>A</span>Fatifatma</label>
                        </div>
                        <div className="cursor-pointer flex items-center px-8 py-5 border-t" onClick={() => setSelectedAwnser("B")}>
                            <input
                                checked={selectedAwnser === "B"}
                                className={"cursor-pointer appearance-none w-4 h-4 rounded-full border-2 border-gray-700 ring-2 ring-orange-600 ring-opacity-100" + (selectedAwnser === "B" ? " bg-orange-500" : "")}
                                type="radio"/>
                            <label className="cursor-pointer flex flex-row items-center text-sm font-medium ml-4"><span className={"cursor-pointer font-bold text-lg px-2"}>B</span>Bom</label>
                        </div>
                        <div className="cursor-pointer flex items-center px-8 py-5 border-t" onClick={() => setSelectedAwnser("C")}>
                            <input
                                checked={selectedAwnser === "C"}
                                className={"cursor-pointer appearance-none w-4 h-4 rounded-full border-2 border-gray-700 ring-2 ring-orange-600 ring-opacity-100" + (selectedAwnser === "C" ? " bg-orange-500" : "")}
                                type="radio"/>
                            <label className="cursor-pointer flex flex-row items-center text-sm font-medium ml-4"><span className={"cursor-pointer font-bold text-lg px-2"}>C</span>Gunpowder</label>
                        </div>
                        <div className="cursor-pointer flex items-center px-8 py-5 border-t" onClick={() => setSelectedAwnser("D")}>
                            <input
                                checked={selectedAwnser === "D"}
                                className={"cursor-pointer appearance-none w-4 h-4 rounded-full border-2 border-gray-700 ring-2 ring-orange-600 ring-opacity-100" + (selectedAwnser === "D" ? " bg-orange-500" : "")}
                                type="radio"/>
                            <label className="cursor-pointer flex flex-row items-center text-sm font-medium ml-4"><span className={"cursor-pointer font-bold text-lg px-2"}>D</span>Geb. Groen Boem</label>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}
