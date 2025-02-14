import React from "react";
import { Modal, Box } from "@mui/material";
import CreateAnnouncement from "./CreateAnnouncement";
import {Button} from "@mui/material";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
};

const CreateAnnouncementModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="create-announcement-modal-title">
            <Box sx={modalStyle}>
                <CreateAnnouncement />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateAnnouncementModal;