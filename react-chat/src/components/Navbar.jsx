import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MoreProfileOptions from "./MoreProfileOptions";

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)

    return (
        <div className="navbar">
            <span className="logo">NexChat</span>
            <div className="user">
                <span>{currentUser.displayName}</span>
                <MoreProfileOptions />
            </div>
        </div>
    )
}

export default Navbar