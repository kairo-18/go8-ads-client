import React, { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    Stack,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";

const CreateScreen = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        routeName: "",
        layoutType: "",
        ads: [{ title: "", mediaUrl: "" }],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdChange = (index, e) => {
        const newAds = [...formData.ads];
        newAds[index][e.target.name] = e.target.value;
        setFormData({ ...formData, ads: newAds });
    };

    const handleFileUpload = async (index, file) => {
        if (!file) return alert("Please select a file");

        const formDataUpload = new FormData();
        formDataUpload.append("ads", file);

        try {
            const response = await fetch("http://localhost:3000/ads-upload", {
                method: "POST",
                body: formDataUpload,
            });

            if (!response.ok) throw new Error("File upload failed");

            const result = await response.json();
            const newAds = [...formData.ads];
            newAds[index].mediaUrl = result.fileUrl;
            setFormData({ ...formData, ads: newAds });
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const addAd = () => {
        setFormData({ ...formData, ads: [...formData.ads, { title: "", mediaUrl: "" }] });
    };

    const removeAd = (index) => {
        const newAds = formData.ads.filter((_, i) => i !== index);
        setFormData({ ...formData, ads: newAds });
    };

    const handleSubmit = async () => {
        try {
            const hasEmptyMedia = formData.ads.some((ad) => !ad.mediaUrl);
            if (hasEmptyMedia) {
                alert("Please upload media for all ads before submitting.");
                return;
            }

            const newScreen = {
                name: formData.name.trim(),
                routeName: formData.routeName.trim(),
                layoutType: formData.layoutType.trim(),
                ads: formData.ads.map(({ title, mediaUrl }) => ({
                    title: title.trim(),
                    mediaUrl: mediaUrl.trim(),
                })),
            };

            await axios.post("http://localhost:3000/screens", newScreen, {
                headers: { "Content-Type": "application/json" },
            });

            alert("Screen created successfully!");
            setFormData({
                name: "",
                routeName: "",
                layoutType: "",
                slot: "left",
                duration: 10,
                ads: [{ title: "", mediaUrl: "" }],
            });
            onClose();
        } catch (error) {
            console.error("Error creating screen:", error);
            alert("Error creating screen. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Screen</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField label="Screen Name" name="name" fullWidth value={formData.name} onChange={handleChange} />
                    <TextField label="Route Name" name="routeName" fullWidth value={formData.routeName} onChange={handleChange} />
                    <FormControl fullWidth>
                        <InputLabel>Layout Type</InputLabel>
                        <Select
                            label="Layout Type"
                            name="layoutType"
                            value={formData.layoutType}
                            onChange={handleChange}
                        >
                            <MenuItem value="Res1">Res1</MenuItem>
                            <MenuItem value="Res2">Res2</MenuItem>
                            <MenuItem value="Res3">Res3</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="h6">Ads</Typography>
                    {formData.ads.map((ad, index) => (
                        <Paper key={index} elevation={1} sx={{ p: 2 }}>
                            <TextField label="Ad Title" name="title" fullWidth value={ad.title} onChange={(e) => handleAdChange(index, e)} />
                            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} fullWidth>
                                Upload Media
                                <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleFileUpload(index, e.target.files[0])} />
                            </Button>
                            {ad.mediaUrl && <Typography variant="body2">Uploaded: {ad.mediaUrl}</Typography>}
                            <IconButton color="error" onClick={() => removeAd(index)} disabled={formData.ads.length === 1}>
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </Paper>
                    ))}
                    <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={addAd} fullWidth>
                        Add Another Ad
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" endIcon={<SendIcon />}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateScreen;
