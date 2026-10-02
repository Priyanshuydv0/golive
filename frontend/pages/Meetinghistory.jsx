import React from 'react';
import { useAuth } from '../AuthContext';
import api from "../src/api/axios";
import { useEffect, useState } from 'react';

function Meetinghistory() {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const getHistory = async () => {
            try {
                const res = await api.get("/history", {
                    withCredentials: true
                });

                console.log("res", res);
                setMeetings(res.data.meetings);

            } catch (e) {
                console.log(e);
            }
        };

        getHistory();
    }, []);

    // Get only the meeting ID from the full URL
    const getMeetingId = (url) => {
        return url.split("/meeting/")[1];
    };

    return (
        <div className="min-h-screen bg-white px-6 py-10">

            {/* Header */}
            <div className="max-w-5xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Meeting History
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View your previous meetings and join them again.
                    </p>
                </div>


                {/* Meeting List */}
                <div className="space-y-4">

                    {meetings.length === 0 ? (
                        <div className="
                            border border-gray-200
                            rounded-2xl
                            p-10
                            text-center
                            shadow-sm
                        ">
                            <div className="
                                mx-auto
                                w-14 h-14
                                rounded-2xl
                                bg-purple-100
                                flex items-center justify-center
                                text-purple-500
                                text-2xl
                            ">
                                🎥
                            </div>

                            <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                No meetings yet
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Your meeting history will appear here.
                            </p>
                        </div>
                    ) : (

                        meetings.map((meeting, index) => {

                            const meetingId = getMeetingId(meeting.meetingId);

                            return (
                                <div
                                    key={index}
                                    className="
                                        bg-white
                                        border border-gray-200
                                        rounded-2xl
                                        p-5
                                        shadow-sm
                                        hover:shadow-md
                                        hover:border-purple-200
                                        transition
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        {/* Meeting Information */}
                                        <div>

                                            <p className="
                                                text-xs
                                                font-medium
                                                text-purple-500
                                                uppercase
                                                tracking-wide
                                            ">
                                                Meeting ID
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xl
                                                font-semibold
                                                text-gray-900
                                            ">
                                                {meetingId}
                                            </p>

                                            <p className="mt-2 text-sm text-gray-500">
                                                {meeting.time}
                                            </p>

                                        </div>


                                        {/* Join Button */}
                                        <button
                                            onClick={() => {
                                                window.location.href =
                                                    `/meeting/${meetingId}`;
                                            }}
                                            className="
                                                px-5 py-2.5
                                                rounded-xl
                                                bg-purple-500
                                                text-white
                                                font-medium
                                                cursor-pointer
                                                hover:bg-purple-600
                                                active:bg-purple-700
                                                transition
                                                shadow-sm
                                            "
                                        >
                                            Join Again
                                        </button>

                                    </div>

                                </div>
                            );
                        })

                    )}

                </div>

            </div>

        </div>
    );
}

export default Meetinghistory;