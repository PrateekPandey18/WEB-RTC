import React from "react";
import { useSocket } from "../providers/Socket";
import { useEffect } from "react";

export default function Room(){
    const {socket} = useSocket()

    const handleNewUserJoined = (data) => {
        const {emailId} = data;
        console.log(emailId)
    }

    useEffect(()=>{
        socket.on('user-joined', handleNewUserJoined )
    },[socket])

    return (
        <div>
            <h1>Room</h1>
        </div>
    )
}