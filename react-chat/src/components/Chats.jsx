import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
    const [chats, setChats] = useState([]);

    const {currentUser} = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext)

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db,"userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats()
    }, [currentUser.uid]);


    const handleSelect = async (info) => {
        const groupId = info[0];
        const title = info[1].info.title;
        const photoURL = info[1].info.photoURL;
        const roomId = info[1].roomId;
        const isGroup = info[1].isGroup;

        // Room data
        const roomInfo = await getDoc(doc(db, "rooms", roomId));
        const users = roomInfo.data().usersInfo;

        const userMap = new Map(users.map((user) => [user.uid, user]))

        const payload = {
            groupId: groupId,
            roomId: roomId,
            users: userMap,
            title: title,
            photoURL: photoURL,
            isGroup: isGroup,
        }

        dispatch({type: "CHANGE_USER", payload: payload})
    }


    return (
        <div className="chats">
            {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map((chat) => (
                <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat)} >
                    <img src={chat[1].info.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{chat[1].info.title}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats