import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";

const TeamContext = createContext();

export function useTeams() {
    return useContext(TeamContext);
}

export function TeamProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);


    const [teamUser, setTeamUser] = useState(() => {
        const storedToken = localStorage.getItem("token")
        return storedToken ? jwtDecode(storedToken) : null;
    });

    const login = (jwtToken) => {
        setToken(jwtToken);
        setTeamUser(jwtDecode(jwtToken));
        localStorage.setItem("token", jwtToken);
    };

    const logout = () => {
        setToken(null);
        setTeamUser(null);
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    // Volg veranderingen in `user` en log uit als token niet klopt
    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setTeamUser(decodedUser);
                console.log("Updated user after token change:", decodedUser); // Log user wanneer token verandert
            } catch (error) {
                console.error("Error decoding token:", error);
                logout();
            }
        }
    }, [token]);

    const value = useMemo(
        () => ({
            teamUser,
            token,
            login,
            logout,
            setToken,
        }),
        [teamUser, token]
    );

    return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
