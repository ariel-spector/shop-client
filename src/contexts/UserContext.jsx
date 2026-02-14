import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { fetchCurrentUser, setAuthHeaders } from "../services/apiService";

const UserContext = createContext();


export const useAuth = () => {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        setAuthHeaders(null);
        setUser(null);
    };

    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem("token");


            if (!token || token === "null") {
                setLoading(false);
                return;
            }

            try {

                setAuthHeaders(token);


                const response = await fetchCurrentUser();


                setUser(response.data);
            } catch (error) {
                console.error("Session invalid or expired:", error);

                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();
    }, []);

    const loginUser = (userData, token) => {
        localStorage.setItem("token", token);
        setAuthHeaders(token);
        setUser(userData);
    };


    const value = useMemo(() => ({
        user,
        loading,
        loginUser,
        logoutUser: handleLogout,
        token: localStorage.getItem("token")
    }), [user, loading]);

    return (
        <UserContext.Provider value={value}>
            {!loading ? children : <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading application...</div>}
        </UserContext.Provider>
    );
}

export default UserContext;