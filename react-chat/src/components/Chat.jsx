import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import MoreChatOptions from "./MoreChatOptions";


const Chat = () => {
    const { data } = useContext(ChatContext);

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.title}</span>
                <div className="chatIcons">
                    <img src={Cam} alt="" />
                    {data.isGroup && <MoreChatOptions /> }
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    )
}

export default Chat