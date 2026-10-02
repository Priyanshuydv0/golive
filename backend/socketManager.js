const { Server } = require("socket.io");

let connections = {};
let messages = {};
let timeOnline = {};

const connectionToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    })

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {
            console.log("on join call")
            if (connections[path] == undefined) {
                connections[path] = [];
            }
            connections[path].push(socket.id)
            timeOnline[socket.id] = new Date
            console.log(connections)
            for (let a = 0; a < connections[path].length; a++) {
                console.log("user joined loop")
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }

            if (messages[path] != undefined) {
                console.log(messages)
                for (let a = 0; a < messages[path].length; a++) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-Id-sender'])

                }
            }
        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (message, username) => {
            console.log("recived message", message)
            const [matchingRoom, found] = Object.entries(connections).reduce(([roomId, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true]
                }
                return [roomId, isFound]
            }, ['', false])
            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({ "sender": username, "data": message, "socket-Id-sender": socket.id })

            }
            for (const id of connections[matchingRoom]) {

                io.to(id).emit(
                    "chat-message",
                    message,
                    username,
                    socket.id
                );

            }
        })

        socket.on("disconnect", () => {
            let timeDiff = Math.abs(Date.now() - timeOnline[socket.id]);
            let key;
            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for (let a = 0; a < v.length; a++) {
                    if (v[a] == socket.id) {
                        key = k;

                        for (let a = 0; a < connections[key][a]; a++) {
                            io.to(connections[key][a]).emit("user-left", socket.id);
                        }

                        var index = connections[key].indexOf(socket.id);
                        connections[key].splice(index, 1)
                        if (connections[key].length == 0) {
                            delete connections[key];
                        }
                    }
                }
            }
        })
    })

}

module.exports = {
    connectionToSocket
};