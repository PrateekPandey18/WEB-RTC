import React from "react";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player"
import {usePeer} from "../providers/Peer"
import { useEffect,useCallback,useState,useRef } from "react";



export default function Room(){
    const {socket} = useSocket()
    const {peer,createOffer,createAnswer,setRemoteAnswer,sendStream,remoteStream} = usePeer();
    const [myStream,setMyStream] = useState(null)
    
    const myVideoRef = useRef();
    const remoteVideoRef = useRef();

    const handleNewUserJoined =useCallback(async (data) => {
        const {emailId} = data;
        console.log(emailId)
        const offer = await createOffer();
        socket.emit("call-user", {emailId,offer})
    },[createOffer,socket])

    const handleIncomingCall = useCallback(async (data) =>{
        const { from,offer } = data;
        console.log("incoming call", from,offer)
        const ans = await createAnswer(offer)
        socket.emit("call-accepted", {emailId:from, ans})
    },[createAnswer, socket])

    const handleCallAccepted = useCallback(async (data)=>{
        const {ans} = data;
        console.log(ans)
        await setRemoteAnswer(ans)
        
    },[setRemoteAnswer])

    const getUserMediaStream = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
        
        setMyStream(stream);

    },[])

    useEffect(()=>{
        socket.on('user-joined', handleNewUserJoined )
        socket.on('incoming-call', handleIncomingCall)
        socket.on("call-accepted", handleCallAccepted)

        return()=>{
            socket.off('user-joined', handleNewUserJoined)
            socket.off('incoming-call', handleIncomingCall)
            socket.off("call-accepted",handleCallAccepted)
        }
    },[handleIncomingCall,handleNewUserJoined,handleCallAccepted,socket])

    useEffect(()=>{
        getUserMediaStream();
    },[getUserMediaStream])

    useEffect(() => {
        // If we have a stream AND the video element has rendered on screen
        if (myStream && myVideoRef.current) {
            myVideoRef.current.srcObject = myStream; // This is the only way to play raw WebRTC streams!
        }
    }, [myStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div>
            <h1>Room</h1>
            <button onClick={() => sendStream(myStream)}>Send My Video</button>
            
            {/* LOCAL VIDEO */}
            {myStream && (
                <video 
                    ref={myVideoRef} 
                    autoPlay 
                    playsInline 
                    muted // Keep your own video muted to prevent echo
                    className="border-2 border-amber-200 rounded-lg mt-4 bg-black w-96"
                />
            )}

            {/* REMOTE VIDEO */}
            {remoteStream && (
                <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    // REMOVED 'muted' so you can hear them!
                    className="border-2 border-blue-500 rounded-lg mt-4 bg-black w-96"
                />
            )}
        </div>
    )
}