import React from 'react';
import image from '../images/person.jpg';
import Btn from '../components/Btn';
import { NavLink } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-[80vh] bg-white flex items-center">

            <div className="
                w-full
                max-w-7xl
                mx-auto
                px-6
                lg:px-12
                py-12
                flex
                flex-wrap-reverse
                lg:flex-nowrap
                items-center
                justify-between
                gap-12
            ">

                {/* Left Content */}
                <div className="w-full lg:w-1/2">

                    {/* Small Badge */}
                    <div className="
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        bg-purple-50
                        border
                        border-purple-100
                        text-purple-500
                        text-sm
                        font-medium
                        mb-6
                    ">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Connect from anywhere
                    </div>

                    {/* Main Heading */}
                    <h1 className="
                        text-4xl
                        sm:text-5xl
                        lg:text-6xl
                        font-bold
                        leading-tight
                        text-gray-900
                    ">
                        Get connected with your
                        <span className="block text-purple-500">
                            loved ones.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="
                        mt-6
                        text-lg
                        sm:text-xl
                        text-gray-500
                        max-w-xl
                        leading-relaxed
                    ">
                        Cover the distance with GoLive. Start a meeting,
                        invite your loved ones, and stay connected wherever
                        you are.
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">

                        <NavLink to="/signup">
                            <Btn
                                children="Get Started"
                                size="lg"
                                color="purple"
                            />
                        </NavLink>

                        <NavLink
                            to="/guest"
                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                text-gray-700
                                font-medium
                                hover:border-purple-500
                                hover:text-purple-500
                                transition
                            "
                        >
                            Join as Guest
                        </NavLink>

                    </div>

                    {/* Small Features */}
                    <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">

                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Easy to use
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Join instantly
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Stay connected
                        </div>

                    </div>

                </div>


                {/* Right Image */}
                <div className="
                    w-full
                    lg:w-1/2
                    flex
                    justify-center
                    lg:justify-end
                ">

                    <div className="relative">

                        {/* Decorative Purple Circle */}
                        <div className="
                            absolute
                            -top-8
                            -right-8
                            w-32
                            h-32
                            bg-purple-200
                            rounded-full
                            blur-2xl
                            opacity-60
                        "></div>

                        {/* Decorative Purple Circle */}
                        <div className="
                            absolute
                            -bottom-8
                            -left-8
                            w-40
                            h-40
                            bg-purple-300
                            rounded-full
                            blur-3xl
                            opacity-40
                        "></div>

                        {/* Image Card */}
                        <div className="
                            relative
                            bg-white
                            p-3
                            rounded-3xl
                            shadow-2xl
                            border
                            border-purple-100
                        ">

                            <img
                                className="
                                    h-[22rem]
                                    sm:h-[27rem]
                                    w-[20rem]
                                    sm:w-[26rem]
                                    object-cover
                                    rounded-2xl
                                "
                                src={image}
                                alt="People connecting through GoLive"
                            />

                            {/* Floating Card */}
                            <div className="
                                absolute
                                -bottom-5
                                -left-5
                                bg-white
                                border
                                border-gray-100
                                shadow-lg
                                rounded-2xl
                                px-5
                                py-3
                            ">
                                <p className="text-xs text-gray-400">
                                    GoLive
                                </p>

                                <p className="text-sm font-semibold text-gray-800">
                                    Stay connected ❤️
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Home;