import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MeetingId() {
    const [meetingId, setMeetingId] = useState("");
    const navigate = useNavigate();

    const handleButton = () => {
        if (!meetingId.trim()) return;

        navigate(`/meeting/${meetingId}`);
    };

    return (
        <div className="min-h-screen w-full bg-white flex">

            {/* Left Section */}
            <div className="w-1/2 min-h-screen flex items-center justify-center px-10">

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Join a Meeting
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Enter the meeting ID to join your meeting.
                        </p>
                    </div>

                    {/* Meeting ID Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting ID
                        </label>

                        <input
                            className="
                                w-full
                                px-4 py-3
                                rounded-xl
                                border border-gray-300
                                outline-none
                                text-gray-800
                                placeholder-gray-400
                                focus:border-purple-500
                                focus:ring-2
                                focus:ring-purple-500/20
                                transition
                            "
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                            placeholder="Enter meeting ID"
                            type="text"
                        />

                        <button
                            className="
                                w-full
                                mt-4
                                py-3
                                rounded-xl
                                bg-purple-500
                                text-white
                                font-semibold
                                cursor-pointer
                                hover:bg-purple-600
                                active:bg-purple-700
                                transition
                                shadow-md
                                hover:shadow-lg
                            "
                            onClick={handleButton}
                        >
                            Join Meeting
                        </button>

                    </div>

                </div>

            </div>


            {/* Right Section */}
            <div className="w-1/2 min-h-screen flex items-center justify-center bg-purple-50">

                <div className="relative w-[80%] max-w-lg">

                    {/* Decorative background */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-60"></div>

                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-40"></div>

                    {/* Main Card */}
                    <div className="
                        relative
                        bg-white
                        rounded-3xl
                        shadow-xl
                        border border-purple-100
                        p-10
                    ">

                        <div className="
                            w-16 h-16
                            rounded-2xl
                            bg-purple-500
                            flex items-center justify-center
                            mb-6
                        ">
                            <span className="text-white text-2xl">
                                🎥
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900">
                            Connect. Talk. Collaborate.
                        </h2>

                        <p className="mt-4 text-gray-500 leading-relaxed">
                            Join your meeting and connect with everyone
                            instantly through a simple and secure video call.
                        </p>

                        <div className="mt-8 flex gap-2">
                            <div className="h-2 w-12 rounded-full bg-purple-500"></div>
                            <div className="h-2 w-4 rounded-full bg-purple-200"></div>
                            <div className="h-2 w-4 rounded-full bg-purple-200"></div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default MeetingId;