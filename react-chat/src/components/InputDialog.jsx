import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const FormDialog = ({open, handleCloseDialog, handleOkDialog, changeValue, toCreateGroup}) => {
  return (
    <div className="formDialog">
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{toCreateGroup ? 'Create Group': 'Join Group'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Group chats are places where you can talk to more than one person at the same time.
            {toCreateGroup ? ' Enter name of the group': ' Enter the group id'}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={toCreateGroup ? "Group Name": "Group Id"}
            fullWidth
            variant="standard"
            onChange={(e) => changeValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleOkDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default FormDialog;