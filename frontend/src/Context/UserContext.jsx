import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [usedRememberMe, setUsedRememberMe] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [token, setToken] = useState(() => Cookies.get("token") || null);
    const [refreshToken, setRefreshToken] = useState(
        () => Cookies.get("refreshToken") || null
    );
    const [user, setUser] = useState(() => {
        const storedToken = Cookies.get("token");
        return storedToken ? jwtDecode(storedToken) : null;
    });
    const [mainUser, setMainUser] = useState(() => {
        const storedToken = Cookies.get("token");
        return storedToken ? jwtDecode(storedToken) : null;
    });

    const login = (jwtToken, jwtRefreshToken) => {
        setToken(jwtToken);
        setRefreshToken(jwtRefreshToken);
        setUser(jwtDecode(jwtToken));
        Cookies.set("token", jwtToken, { expires: 1 / 24 });
        usedRememberMe
            ? Cookies.set("refreshToken", jwtRefreshToken, { expires: 7 })
            : Cookies.set("refreshToken", jwtRefreshToken, { expires: 1 });
    };

    const updateToken = async (newToken) => {
        setToken(newToken);
        setUser(jwtDecode(newToken));
        Cookies.set("token", newToken, { expires: 1 / 24 });
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setRefreshToken(null);
        Cookies.remove("token");
        Cookies.remove("refreshToken");
    };

    const forceRefreshAccessToken = async () => {
        if (!refreshToken) return;

        try {
            const response = await fetch(backend + "/user/token/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const { token: newToken } = await response.json();
            updateToken(newToken);
        } catch (error) {
            console.error("Error refreshing token:", error);
        }
    };
    const forceRefreshAccessTokenReload = async () => {
        if (!refreshToken) return;

        try {
            const response = await fetch(backend + "/user/token/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const { token: newToken } = await response.json();
            await updateToken(newToken);
            window.location.reload();
        } catch (error) {
            console.error("Error refreshing token:", error);
        }
    };

    useEffect(() => {
        const refreshAccessToken = async () => {
            if (!refreshToken) return;

            try {
                const response = await fetch(backend + "/user/token/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (!response.ok) {
                    throw new Error(`Token refresh failed: ${response.status}`);
                }

                const { token: newToken } = await response.json();
                updateToken(newToken);
            } catch (error) {
                console.error("Error refreshing token:", error);
                logout();
            }
        };

        const verifyToken = (token) => {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    console.error("Token is expired, logging out!");
                    logout();
                    return false;
                }

                if (decodedToken.exp - currentTime < 360) {
                    refreshAccessToken();
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
    }, [token, refreshToken]);

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
            mainUser,
            token,
            refreshToken,
            isTokenValid,
            login,
            logout,
            updateToken,
            forceRefreshAccessToken,
            forceRefreshAccessTokenReload,
            setUsedRememberMe,
            setToken,
            setRefreshToken,
            usedRememberMe,
        }),
        [user, token, refreshToken, isTokenValid, usedRememberMe]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
