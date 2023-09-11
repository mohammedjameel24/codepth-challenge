import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { onSnapshot,doc } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.roomId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        })

        if(data.roomId == "null") {
            setMessages([]);
        }
        return () => {
            unSub();
        }
    }, [data]);

    return (
        <div className="messages">
            {messages.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    )
}

export default Messages