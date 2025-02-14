import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Modal,
    Box,
    Button,
    TextField,
    IconButton,
    Typography,
    Container,
    Paper,
    Grid,
    Select,
    MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh", // Restrict modal height
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
    display: "flex",
    flexDirection: "column",
};

const scrollableContent = {
    overflowY: "auto", // Enable vertical scrolling
    flexGrow: 1,
    paddingRight: "10px", // Prevent content cutoff due to scrollbar
};

const UpdateScreen = ({ open, onClose }) => {
    const [screens, setScreens] = useState([]);

    useEffect(() => {
        if (open) fetchScreens();
    }, [open]);

    const fetchScreens = async () => {
        try {
            const response = await axios.get("http://localhost:3000/screens");
            setScreens(response.data);
        } catch (error) {
            console.error("Error fetching screens:", error);
        }
    };

    const handleUpdateScreen = async (screenId, updatedScreen) => {
        try {
            await axios.patch(
                `http://localhost:3000/screens/${screenId}`,
                updatedScreen,
                { headers: { "Content-Type": "application/json" } }
            );
            alert("Screen updated successfully!");
            fetchScreens();
        } catch (error) {
            console.error("Error updating screen:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="update-modal-title">
            <Box sx={modalStyle}>
                <Typography id="update-modal-title" variant="h4" sx={{ mb: 2 }}>
                    Update Screens
                </Typography>

                <Box sx={scrollableContent}>
                    {screens.map((screen, screenIndex) => (
                        <Paper key={screen.id} elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Screen Name"
                                        value={screen.name}
                                        onChange={(e) => {
                                            const newScreens = [...screens];
                                            newScreens[screenIndex].name = e.target.value;
                                            setScreens(newScreens);
                                        }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Route Name"
                                        value={screen.routeName}
                                        onChange={(e) => {
                                            const newScreens = [...screens];
                                            newScreens[screenIndex].routeName = e.target.value;
                                            setScreens(newScreens);
                                        }}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            {/* Layout Type Dropdown */}
                            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                                <Select
                                    fullWidth
                                    value={screen.layoutType || ""}
                                    onChange={(e) => {
                                        const newScreens = [...screens];
                                        newScreens[screenIndex].layoutType = e.target.value;
                                        setScreens(newScreens);
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="">Select Layout Type</MenuItem>
                                    <MenuItem value="Res1">Res1</MenuItem>
                                    <MenuItem value="Res2">Res2</MenuItem>
                                    <MenuItem value="Res3">Res3</MenuItem>
                                </Select>
                            </Grid>

                            <Typography variant="h6" sx={{ mt: 3 }}>
                                Ads
                            </Typography>

                            {screen.ads.map((ad, adIndex) => (
                                <Box key={ad.id} sx={{ mb: 3 }}>
                                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Ad Title"
                                            value={ad.title}
                                            onChange={(e) => {
                                                const newScreens = [...screens];
                                                newScreens[screenIndex].ads[adIndex].title = e.target.value;
                                                setScreens(newScreens);
                                            }}
                                            variant="outlined"
                                        />
                                        <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                                            Upload File
                                            <input type="file" hidden />
                                        </Button>
                                        <IconButton
                                            onClick={() => {
                                                const newScreens = [...screens];
                                                newScreens[screenIndex].ads.splice(adIndex, 1);
                                                setScreens(newScreens);
                                            }}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Start Date"
                                            value={ad.startDate ? dayjs(ad.startDate) : null}
                                            onChange={(newDate) => {
                                                const newScreens = [...screens];
                                                newScreens[screenIndex].ads[adIndex].startDate = newDate.toISOString();
                                                setScreens(newScreens);
                                            }}
                                        />
                                        <DateTimePicker
                                            label="End Date"
                                            value={ad.endDate ? dayjs(ad.endDate) : null}
                                            onChange={(newDate) => {
                                                const newScreens = [...screens];
                                                newScreens[screenIndex].ads[adIndex].endDate = newDate.toISOString();
                                                setScreens(newScreens);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            ))}

                            <Button
                                variant="contained"
                                onClick={() => {
                                    const newScreens = [...screens];
                                    newScreens[screenIndex].ads.push({ title: "", mediaUrl: "" });
                                    setScreens(newScreens);
                                }}
                            >
                                Add Ad
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ ml: 2 }}
                                onClick={() => handleUpdateScreen(screen.id, screen)}
                            >
                                Update Screen
                            </Button>
                        </Paper>
                    ))}
                </Box>

                {/* Close Button */}
                <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateScreen;
