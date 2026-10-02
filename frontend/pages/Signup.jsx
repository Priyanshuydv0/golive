import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Btn from '../components/Btn';
import api from '../src/api/axios';
import { useNavigate } from 'react-router-dom';



function Signup() {
    const Navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    const handleSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        try {
            const res = await api.post("/signup", (formData));
            console.log(res);

            alert(res.data.message);
            if (res.statusText === "OK") {
                Navigate("/login")
            }


        }
        catch (err) {
            alert(err.response?.data?.message || "something went wrong");
        }
    }
    return (
        <>
            <div className='flex flex-col h-100 justify-center items-center '>
                <div className='flex mt-5 gap-3'>
                    <NavLink to={"/login"} className='cursor-pointer'>Login</NavLink>
                    <NavLink to={"/signup"} className='cursor-pointer'>Signup</NavLink>
                </div>
                <form className='flex flex-col gap-4 mt-6 w-full max-w-sm ' onSubmit={handleSubmit} action="">
                    <input
                        className='rounded-2xl p-2'
                        name='name'
                        value={formData.name}
                        type="text"
                        placeholder='Enter name'
                        onChange={handleInput}
                    />
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
                        value={formData.pass}
                        type="password"
                        placeholder='Enter password'
                        onChange={handleInput}
                    />
                    <Btn
                        type="submit"
                        children="signup"
                        color='purple'
                        className='mt-3'


                    />
                </form>
            </div>

        </>
    )
}

export default Signup
