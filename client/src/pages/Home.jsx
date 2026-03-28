import React, { useCallback } from "react"
import { useSocket } from "../providers/Socket"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const {socket} = useSocket();
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [roomId,setRoomId] = useState("");

    const handleRoomJoined = useCallback(({roomId}) => {
        navigate(`/room/${roomId}`)
    }, [navigate])

    useEffect(()=>{
        socket.on("joined-room", handleRoomJoined)
        return () => {
        socket.off("joined-room", handleRoomJoined);
    };
    },[handleRoomJoined,socket])

    const handleJoinRoom = () =>{
        socket.emit("join-room", {emailId: email, roomId});
    }

    return(
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="flex flex-col">
                <input value={email} onChange={e =>setEmail(e.target.value)} type="email" className="border-amber-200 border-2" />
                <input value={roomId} onChange={e =>setRoomId(e.target.value)} type="text" className="border-amber-200 border-2"  />
                <button onClick={handleJoinRoom}>join room</button>
            </div>
            
        </div>
    )
}