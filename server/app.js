const express = require("express");
const {Server} = require("socket.io");
const bodyParser = require("body-parser");

const io = new Server({
    cors: true,
});
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map()

io.on("connection", (socket) => {
    console.log("new Connection");
    socket.on("join-room",(data)=>{
        const {roomId,emailId} = data;
        emailToSocketMapping.set(emailId,socket.id)
        console.log(roomId,emailId)
        socket.join(roomId);
        socket.emit("joined-room",{roomId})
        socket.broadcast.to(roomId).emit("user-joined",{emailId});
    })
}); 

app.listen(8000, () => console.log("server running at 8000"))
io.listen(8001);