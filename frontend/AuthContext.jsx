import { createContext, useContext, useEffect, useState } from "react"
const AuthContext = createContext();
import api from "./src/api/axios"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {

        try {
            console.log("calling auth api")
            const res = await api.get("/auth", {
                withCredentials: true
            })
            setUser(res);
            console.log(res);
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};
export const useAuth = () => {
    return useContext(AuthContext);
};