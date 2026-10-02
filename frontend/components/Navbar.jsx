import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from "../src/api/axios";

function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("LOGOUT CLICKED");

        try {
            console.log("CALLING API");

            const res = await api.post(
                "/logout",
                {},
                {
                    withCredentials: true
                }
            );

            console.log("API RESPONSE:", res);

            if (res.data.success) {

                // Backend has deleted the token cookie.
                // Now remove the user from React auth state.
                setUser(null);

                // Navigate to login page.
                navigate("/login", { replace: true });
            }

        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        }
    };

    return (
        <div className="border-b-3 border-purple-500 text-black w-full flex h-auto gap-2 justify-between p-2 px-4">

            {/* Logo */}
            <div className="text-lg font-bold">
                <Link to="/">
                    GO LIvEE
                </Link>
            </div>

            {!user ? (

                /* Logged out */
                <div className="flex gap-2">
                    <NavLink to="/login">
                        Login
                    </NavLink>

                    <NavLink to="/signup">
                        Signup
                    </NavLink>

                    <NavLink to="/guest">
                        Guest
                    </NavLink>
                </div>

            ) : (

                /* Logged in */
                <div className="flex gap-2">

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                    <NavLink to="/history">
                        Meeting history
                    </NavLink>

                </div>
            )}

        </div>
    );
}

export default Navbar;