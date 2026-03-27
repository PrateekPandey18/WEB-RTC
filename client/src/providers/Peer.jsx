import React from "react";

const PeerContext = React.createContext(null);

export const PeerProvider = (props) => {
    const peer = useMemo(()=> new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                ],
            },
        ],
    }),[]);

    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    return(
        <PeerContext.Provider value={{peer,createOffer}}>{props.childern}</PeerContext.Provider>
    ) 
}