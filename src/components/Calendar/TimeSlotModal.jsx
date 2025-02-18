import React from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Box
} from "@mui/material";

const TimeSlotModal = ({ open, onClose, selectedDate, selectedSlots, handleSlotSelection, layoutType, renderUploadPrompts, ad = {} }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {selectedDate ? `Select Advert Slots for ${selectedDate.toDateString()}` : "Select Advert Slots"}
            </DialogTitle>
            <DialogContent>
                {layoutType === "" ? (
                    <Typography color="error">Please choose a layout first.</Typography>
                ) : (
                    <>
                        <Grid container spacing={1}>
                            {Array.from({ length: 48 }).map((_, index) => (
                                <Grid item xs={2} key={index}>
                                    <Button
                                        variant={selectedSlots.includes(index) ? "contained" : "outlined"}
                                        onClick={() => handleSlotSelection(index)}
                                        fullWidth
                                    >
                                        {`${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        {/* {renderUploadPrompts()} */}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Close</Button>
                <Button onClick={() => alert("Saved selections!")} color="primary" variant="contained">Finish</Button>
            </DialogActions>
        </Dialog>
    );
};

TimeSlotModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedDate: PropTypes.instanceOf(Date),
    selectedSlots: PropTypes.arrayOf(PropTypes.number).isRequired,
    handleSlotSelection: PropTypes.func.isRequired,
    layoutType: PropTypes.string.isRequired,
    renderUploadPrompts: PropTypes.func.isRequired,
    ad: PropTypes.shape({
        mediaUrl: PropTypes.string
    })
};

export default TimeSlotModal;
