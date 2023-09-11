import React, { useContext, useState } from "react";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("displayName", "==", username));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
            console.log(err);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        // check wether the group(chats exist in firestore) exists, if not create
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "groups", combinedId));
            
            if(!res.exists()) {
                // Unique room
                const roomId = uuid()

                // Set the chat to be empty
                await setDoc(doc(db, "chats", roomId), {messages: []});

                // Map id -> room
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId+".info"]: {
                        title: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId+".date"]: serverTimestamp(),
                    [combinedId+".roomId"]: roomId,
                    [combinedId+".isGroup"]: false,
                })

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId+".info"]: {
                        title: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId+".date"]: serverTimestamp(),
                    [combinedId+".roomId"]: roomId,
                    [combinedId+".isGroup"]: false,
                })

                // Map group to room
                await setDoc(doc(db, "groups", combinedId), {roomId: roomId});

                // Map room to user
                await setDoc(doc(db, "rooms", roomId), {
                    parent: combinedId,
                    usersInfo: [
                        {
                            uid: currentUser.uid,
                            displayName: currentUser.displayName,
                            email: currentUser.email,
                            photoURL: currentUser.photoURL,
                            member: true,
                        },
                        {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            member: true,
                        },
                    ]
                });
            }

            // Group data
            const info = await getDoc(doc(db, "userChats", currentUser.uid));
            const infoData = info.data()[combinedId];
            const title = infoData.info.title;
            const photoURL = infoData.info.photoURL;
            const roomId = infoData.roomId;
            const isGroup = infoData.isGroup;
            
            // Room data
            const roomInfo = await getDoc(doc(db, "rooms", roomId));
            const users = roomInfo.data().usersInfo;

            const userMap = new Map(users.map((user) => [user.uid, user]))

            const payload = {
                groupId: combinedId,
                roomId: roomId,
                users: userMap,
                title: title,
                photoURL: photoURL,
                isGroup: isGroup,
            }

            dispatch({type: "CHANGE_USER", payload: payload})
        } catch (err) {
            console.log(err)
        }
        
        setUser(null)
        setUsername("")
    };

    return (
        <div className="search">
            <div className="searchForm">
                <input 
                  type="text" 
                  placeholder="find a user"
                  onKeyDown={handleKey}
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
            </div>
            {err && <span>User not found!</span>}
            {user && <div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                    <p>{user.email}</p>
                </div>
            </div>}
        </div>
    )
}

export default Search