import {createContext, useContext, useMemo} from "react";

const GameContext = createContext();

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}) {
    const value = useMemo(
        () => ({

        }), []
    )
    return <GameContext.Provider value={{}}></GameContext.Provider>
}