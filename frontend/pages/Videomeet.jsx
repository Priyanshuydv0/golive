
import Btn from "../components/Btn";
import React, { useEffect, useRef, useState } from "react";
const Server_url = meta.env.BACKEND_URL;
import { io } from "socket.io-client";

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import ChatIcon from '@mui/icons-material/Chat';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';

import api from "../src/api/axios";
var connections = {};
let connectionStates = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

function Videomeet() {

    var socketRef = useRef();
    var socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(false);

    let [audioAvailable, setAudioAvailable] = useState(false);

    let [video, SetVideo] = useState(false);
    let [chatModal, setChatModal] = useState(false);

    let [audio, setAudio] = useState(false);

    let [screen, setScreen] = useState(false);

    let [showModal, setModal] = useState();

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message, setMessage] = useState("");

    // let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);


    const connect = async () => {
        try {
            const postHistory = async () => {   // calling api to save meeting history
                try {
                    let res = await api.post("/history", {
                        meetingId: window.location.href
                    }, { withCredentials: true })
                } catch (error) {
                    console.log("error on post meeting history", error)
                }
                console.log("Connecting...");
            }


            let stream = null;

            // Try to get real camera/microphone

            if (videoAvailable || audioAvailable) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: videoAvailable,
                        audio: audioAvailable
                    });

                    console.log("✅ Real media stream obtained");

                } catch (error) {
                    console.log(
                        "⚠️ Could not get real media:",
                        error
                    );
                }
            }

            // If permission was denied OR no devices are available
            if (!stream) {
                console.log("Creating black + silent stream");

                stream = new MediaStream([
                    black(),
                    silence()
                ]);
            }

            // Make sure video track exists
            if (stream.getVideoTracks().length === 0) {
                console.log("Adding black video");

                stream.addTrack(black());
            }

            // Make sure audio track exists
            if (stream.getAudioTracks().length === 0) {
                console.log("Adding silent audio");

                stream.addTrack(silence());
            }

            console.log("🎥 Final stream:", stream.getTracks());

            // Save stream
            window.localStream = stream;

            // Display local stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Leave lobby
            setAskForUsername(false);

            // Connect Socket.IO
            connectToSocketServer();
            postHistory();

        } catch (error) {
            console.error("❌ Connect error:", error);
        }
    };

    const permission = async () => {
        try {
            console.log("Checking camera and microphone...");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            console.log("✅ Camera/microphone permission granted");

            setVideoAvailable(
                stream.getVideoTracks().length > 0
            );

            setAudioAvailable(
                stream.getAudioTracks().length > 0
            );


            stream.getTracks().forEach((track) => {
                track.stop();
            });

        } catch (error) {
            console.log("⚠️ Camera/microphone unavailable:", error);



            setVideoAvailable(false);
            setAudioAvailable(false);
        }


        setScreenAvailable(
            !!navigator.mediaDevices.getDisplayMedia
        );
    };


    useEffect(() => {
        permission()
    }, [])

    
    useEffect(() => {
        let userMediaStream;
        if (videoAvailable || audioAvailable) {
            userMediaStream = navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })
                .then((stream) => {
                    if (stream) {
                        window.localStream = stream;
                    }
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                }).catch((err) => {
                    console.log(err);
                })
        }
    }, [videoAvailable, audioAvailable])


    useEffect(() => {
        if (!askForUsername && localVideoRef.current && window.localStream) {
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [askForUsername]);


    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach((track) => { track.stop() })
        } catch (e) {
            console.log(e)

        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach(track => track.onended = () => {
            SetVideo(false)
            setAudio(false)
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            }
            catch (e) { console.log(e) }

            let blacksilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blacksilence()
            localVideoRef.current.srcObject = window.localStream;
        })

        for (let id in connections) {
            if (id == socketIdRef.current) continue;
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))

            })
        }
    }


    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }


    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        let stream = canvas.captureStream(30);

        // Don't disable the video track
        return stream.getVideoTracks()[0];

    }


    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                // .then(() => { })
                .catch((e) => console.log(e))
        }
        else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            catch (e) {
                console.log(e)
            }
        }
    }


    useEffect(() => {
        if (video != undefined && audio != undefined) {
            getUserMedia();
        }
    }, [audio, video])

    let getMedia = () => {
        setAudio(audioAvailable);
        SetVideo(videoAvailable)
    }

    let gotMessageFromServer = async (fromId, message) => {

        let signal = JSON.parse(message)
        console.log(fromId)

        if (fromId != socketIdRef.current) {

            if (signal.sdp) {

                console.log(signal.sdp)

                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {

                    if (signal.sdp.type == 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: connections[fromId].localDescription }))
                            }).catch((err) => {
                                console.log(err)
                            })
                        })

                    }
                }).catch((err) => {
                    console.log(err)
                })


            }
            if (signal.ice) {
                console.log(signal.ice)
                console.log("🧊 ICE received from:", fromId);

                await connections[fromId].addIceCandidate(
                    new RTCIceCandidate(signal.ice)
                );
            }
        }

    }

    let addMessage = (message, username, senderId) => {
        console.log("message", message)
        setMessages((prev) => [
            ...prev,
            {
                data: message,
                sender: username,
                senderId: senderId
            }
        ])
    }

    let connectToSocketServer = () => {

        socketRef.current = io.connect(Server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        console.log("socketref", socketRef)


        socketRef.current.on("connect", () => {

            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id;
            console.log("socketidref", socketIdRef)
            socketRef.current.on("chat-message", addMessage)

            socketRef.current.on("user-left", (id) => {
                SetVideo((preVideos) => preVideos.filter((video) => video.socketId != id))
            })

            socketRef.current.on("user-joined", (id, clients) => {
                console.log("user joined called")
                clients.forEach((socketListId) => {
                    console.log("creating rtc connection");
                    if (socketListId === socketIdRef.current) {
                        return;
                    }
                    if (connections[socketListId]) {
                        return;
                    }



                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId].onconnectionstatechange = () => {
                        connectionStates[socketListId] = socketListId.connectionstate;
                        console.log(connectionstate)
                    }

                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }



                    connections[socketListId].ontrack = (event) => {
                        const stream = event.streams[0];

                        if (!stream) return;

                        setVideos(prevVideos => {
                            const existing = prevVideos.find(
                                video => video.socketId === socketListId
                            );

                            if (existing) {
                                return prevVideos.map(video =>
                                    video.socketId === socketListId
                                        ? {
                                            ...video,
                                            stream: stream
                                        }
                                        : video
                                );
                            }

                            return [
                                ...prevVideos,
                                {
                                    socketId: socketListId,
                                    stream: stream
                                }
                            ];
                        });

                    };
                    if (window.localStream) {

                        console.log("ADDING LOCAL STREAM TO:", socketListId);

                        console.log(
                            "TRACKS:",
                            window.localStream.getTracks()
                        );

                        window.localStream.getTracks().forEach((track) => {

                            connections[socketListId].addTrack(
                                track,
                                window.localStream
                            );

                        });

                        console.log(
                            "SENDERS:",
                            connections[socketListId].getSenders()
                        );
                    }
                    else {
                        //todo blackscilence
                        //let blacksilence
                        let blacksilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blacksilence()
                        window.localStream.getTracks().forEach((track) => {
                            connections[socketListId].addTrack(
                                track,
                                window.localStream
                            );
                        });
                    }

                })
                if (id == socketIdRef.current) { // checking only user who joined execute this
                    console.log("sending sdp from", id)
                    for (let id2 in connections) {
                        if (id2 == socketIdRef.current) continue
                        // try {
                        //     connections[id2].addStream(window.localStream)
                        //     console.log(window.localStream)
                        // } catch (e) { }
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                                    console.log(connections[id2].localDescription)
                                })
                                .catch(e => console.log(e));
                        })

                    }
                }

            })


        })
    }


    let handelVideo = () => {
        SetVideo(!video)
    }
    let handelAudio = () => {
        setAudio(!audio)
    }
    let handelScreen = () => {
        setScreen(!screen)
    }
    const getDisplayMediaSuccess = async (screenStream) => {
        try {
            const screenTrack = screenStream.getVideoTracks()[0];

            if (!screenTrack) {
                return;
            }

            // Show screen locally
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream;
            }

            // Replace camera video with screen video
            for (let id in connections) {

                if (id === socketIdRef.current) {
                    continue;
                }

                const connection = connections[id];

                const videoSender = connection
                    .getSenders()
                    .find(sender => sender.track?.kind === "video");

                if (videoSender) {
                    await videoSender.replaceTrack(screenTrack);
                }
            }

            // When user clicks "Stop sharing" from browser
            screenTrack.onended = async () => {

                setScreen(false);

                // Get camera again
                try {
                    const cameraStream =
                        await navigator.mediaDevices.getUserMedia({
                            video: video,
                            audio: audio
                        });

                    const cameraTrack =
                        cameraStream.getVideoTracks()[0];

                    if (cameraTrack) {

                        // Show camera locally
                        window.localStream = cameraStream;

                        if (localVideoRef.current) {
                            localVideoRef.current.srcObject =
                                cameraStream;
                        }

                        // Replace screen track with camera track
                        for (let id in connections) {

                            if (id === socketIdRef.current) {
                                continue;
                            }

                            const connection = connections[id];

                            const videoSender = connection
                                .getSenders()
                                .find(sender =>
                                    sender.track?.kind === "video"
                                );

                            if (videoSender) {
                                await videoSender.replaceTrack(
                                    cameraTrack
                                );
                            }
                        }
                    }

                } catch (error) {
                    console.error(
                        "Could not restore camera:",
                        error
                    );
                }
            };

        } catch (error) {
            console.error(
                "Screen sharing error:",
                error
            );
        }
    };
    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    useEffect(() => {
        if (screen != undefined) {
            getDisplayMedia()
        }
    }, [screen])

 //handling chat section
    const handleChatModal = () => {
        setChatModal((prev) => !prev);
    }
    const handleLocalMessage = (e) => {
        setMessage(e.target.value)
        console.log(message)
    }
    const sendMessage = () => {
        socketRef.current.emit("chat-message", message, username)
        setMessage("");
    }


    // ending call on Endcall button

    const callEnd = () => {
        // Stop local media
        if (window.localStream) {
            window.localStream.getTracks().forEach((track) => {
                track.stop();
            });
            window.localStream = null;
        }

        // Close WebRTC connections
        for (let id in connections) {
            connections[id].close();
            delete connections[id];
        }

        // This automatically triggers backend socket.on("disconnect")
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        setVideos([]);
        setAskForUsername(true);
        SetVideo(false);
        setAudio(false);
        setScreen(false);
    };


    return (


        <div className="bg-blue-950 h-full w-full relative " >
            {askForUsername === true ? (
                <div className="p-1">
                    <h2 className="text-white">enter into lobby</h2>

                    <input
                        className="m-2 p-2 rounded-2xl text-white"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="enter username"
                    />

                    <Btn
                        onClick={connect}
                        children={"connect"}
                        size="md"
                        color="purple"
                    />
                </div>
            ) : null}



            {!askForUsername && (

                <div className="w-full h-full relative bg-blue-70">
                    <video className="absolute bottom-4 left-4 h-80 w-80 rounded-4xl"
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        width="640"
                        height="480"
                        style={{
                            backgroundColor: "black"
                        }}
                    />
                    <div className="flex gap-10 w-screen h-[60vh]">
                        {videos.map((video) => (


                            <video key={video.socketId}
                                autoPlay
                                playsInline
                                ref={(element) => {
                                    if (element) {
                                        element.srcObject = video.stream;
                                    }
                                }}

                            />

                        ))}
                    </div>
                    <div className="flex gap-4 w-full items-center justify-center absolute bottom-2">
                        <div>{video == true ? <VideocamIcon onClick={handelVideo} className="text-white" fontSize="large" /> : <VideocamOffIcon onClick={handelVideo} className="text-white" fontSize="large" />}</div>
                        <div>{audio == true ? <MicNoneIcon onClick={handelAudio} className="text-white" fontSize="large" /> : <MicOffIcon onClick={handelAudio} className="text-white" fontSize="large" />}</div>
                        <div>{screen == true ? <ScreenShareIcon onClick={handelScreen} className="text-white" fontSize="large" /> : <StopScreenShareIcon onClick={handelScreen} className="text-white" fontSize="large" />}</div>
                        <div> <CallEndIcon onClick={callEnd} className="text-white fontSize='large" /></div>
                        <ChatIcon onClick={handleChatModal} className="text-white" fontSize="large" />


                    </div>
                    {chatModal == true ? <div className="chat-modal flex absolute right-2 top-2 w-[20%] h-[90%] box-border  bg-white">
                        <div className="message-cont w-[100%] h-[95%] overflow-y-scroll">
                            <h2 className="sticky top-0 z-index-10 bg-white-500 w-[100%]">Chat</h2>
                            {messages.map((item, index) => {
                                return (
                                    <div className="mt-4 ml-4 " key={index}>
                                        <p className="">{item.sender}</p>
                                        <p>{item.data}</p>

                                    </div>
                                )
                            })}


                        </div>
                        <div className=" absolute bottom-0 gap-1 flex items-center w-[100%] h-[5%]">
                            <input onChange={handleLocalMessage} value={message} placeholder="enter message" className="   w-[80%] h-[100%]" type="text" />
                            <button onClick={sendMessage} className="rounded-1xl bg-blue-400 text-white">Send</button>
                        </div>


                    </div> : <></>}

                </div>


            )}

        </div>
    );


}

export default Videomeet;