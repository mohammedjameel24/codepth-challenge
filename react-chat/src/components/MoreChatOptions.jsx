import React, { useContext, useState } from "react";
import More from "../img/more.png";
import { Menu, MenuItem, ListItemIcon,IconButton } from '@mui/material';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { ExitToApp, People } from '@mui/icons-material';
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { arrayRemove, arrayUnion, deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import MembersListDialog from "./MemberList";

const MoreChatOptions = () => {
    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(ChatContext);

    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleInviteFriends =async () => {
        setAnchorEl(null);
        const message = `Hello, join my group ${data.title} using the below code: ${data.groupId}`
        await navigator.clipboard.writeText(message);
        alert("Invite code copied in clipboard");
    };

    const handleMembersList = () => {
        setAnchorEl(null);
        handleOpenDialog();
    };

    const handleLeaveGroup = async () => {
        setAnchorEl(null);

        const groupId = data.groupId;
        const roomId = data.roomId;

        // Delete from UserChats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [groupId]: deleteField(),
        });

        // Update the group users list
        await updateDoc(doc(db, "rooms", roomId), {
            usersInfo: arrayRemove({
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                email: currentUser.email,
                member: true,
             }),
        });

        // Update the group users list
        await updateDoc(doc(db, "rooms", roomId), {
            usersInfo: arrayUnion({
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                email: currentUser.email,
                member: false,
             }),
        });

        dispatch({type: "RESET"});
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="moreOptions">
        <div className="icon">
            <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <img src={More} alt="" />
            </IconButton>
        </div>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
            elevation: 0,
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={handleInviteFriends}>
            <ListItemIcon>
                <PersonAdd fontSize="small" />
            </ListItemIcon>
            Invite Friends
            </MenuItem>
            <MenuItem onClick={handleMembersList}>
            <ListItemIcon>
                <People fontSize="small" />
            </ListItemIcon>
            Members
            </MenuItem>
            <MenuItem onClick={handleLeaveGroup}>
            <ListItemIcon>
                <ExitToApp fontSize="small" />
            </ListItemIcon>
            Leave Group
            </MenuItem>
        </Menu>
        <MembersListDialog open={openDialog} handleClose={handleCloseDialog} />
        </div>
    );
}

export default MoreChatOptions;
