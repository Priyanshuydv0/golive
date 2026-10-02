import React, { useEffect, useState } from 'react';
import Btn from '../components/Btn';
import { NavLink, useNavigate } from 'react-router-dom';
import api from "../src/api/axios";
import { useAuth } from '../AuthContext';

function Login() {
    const { user, loading,checkAuth  } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (!loading && user) {
            navigate("/meet", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading..</div>;
    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/login", formData, {
                withCredentials: true
            });

            console.log(res);
            alert(res.data.message);

            if (res.status === 200) {

                // Get the newly logged-in user
                await checkAuth();

                // Now go to meeting page
                navigate("/meet", { replace: true });
            }

        } catch (err) {
            console.log(err);

            alert(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className='flex flex-col h-100 justify-center items-center'>

            <div className='flex mt-5 gap-3'>
                <NavLink to="/login" className='cursor-pointer'>
                    Login
                </NavLink>

                <NavLink to="/signup" className='cursor-pointer'>
                    Signup
                </NavLink>
            </div>

            <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-4 mt-6 w-full max-w-sm'
            >
                <input
                    className='rounded-2xl p-2'
                    name='email'
                    value={formData.email}
                    type="email"
                    placeholder='Enter email'
                    onChange={handleInput}
                />

                <input
                    className='rounded-2xl p-2'
                    name='password'
                    value={formData.password}
                    type="password"
                    placeholder='Enter password'
                    onChange={handleInput}
                />

                <Btn
                    type="submit"
                    children="Login"
                    color='purple'
                    className='mt-3'
                />
            </form>
        </div>
    );
}

export default Login;