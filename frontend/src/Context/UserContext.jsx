import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);


    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token")
        return storedToken ? jwtDecode(storedToken) : null;
    });

    const login = (jwtToken) => {
        setToken(jwtToken);
        setUser(jwtDecode(jwtToken));
        localStorage.setItem("token", jwtToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    useEffect(() => {
        const verifyToken = (token) => {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    console.error("Token is expired, logging out!");
                    logout();
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Error decoding token:", error);
                return false;
            }
        };

        const checkValidToken = () => {
            if (!token) {
                setIsTokenValid(false);
                return;
            }

            const isValid = verifyToken(token);
            setIsTokenValid(isValid);
        };

        checkValidToken();

        const intervalId = setInterval(() => {
            checkValidToken();
        }, 1 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [token]);

    // Volg veranderingen in `user` en log uit als token niet klopt
    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                console.log("Updated user after token change:", decodedUser); // Log user wanneer token verandert
            } catch (error) {
                console.error("Error decoding token:", error);
                logout();
            }
        }
    }, [token]);

    const value = useMemo(
        () => ({
            user,
            token,
            isTokenValid,
            login,
            logout,
            setToken,
        }),
        [user, token, isTokenValid]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
