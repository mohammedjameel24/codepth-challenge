import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { 
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography 
} from "@mui/material";


const MembersListDialog = ({open, handleClose}) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    return (
        <div className="memberList">
            <Dialog open={open} handleClose={handleClose}>
                <DialogTitle>Members List</DialogTitle>
                <DialogContent>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                        {[...data.users.values()].map((user) =>  {
                            if(!user.member) {
                                return (<div></div>);
                            }
                            
                            return (
                                <div>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={user.photoURL} />
                                        </ListItemAvatar>
                                        <ListItemText
                                        primary={`${user.displayName} ${(user.uid === currentUser.uid ? '(You)': '')}`}
                                        secondary={user.email}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </div>
                            )
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MembersListDialog;