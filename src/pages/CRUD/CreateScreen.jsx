import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";

const CreateScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    routeName: "",
    layoutType: "",
    ads: [{ title: "", mediaUrl: "" }],
  });

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle ad input changes (excluding mediaUrl)
  const handleAdChange = (index, e) => {
    const newAds = [...formData.ads];
    newAds[index][e.target.name] = e.target.value;
    setFormData({ ...formData, ads: newAds });
  };

  // Handle file upload
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
      console.log("Uploaded File Path:", result.fileUrl);

      // Update mediaUrl in the specific ad entry
      const newAds = [...formData.ads];
      newAds[index].mediaUrl = result.fileUrl;
      setFormData({ ...formData, ads: newAds });

    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Add new ad field
  const addAd = () => {
    setFormData({ ...formData, ads: [...formData.ads, { title: "", mediaUrl: "" }] });
  };

  // Remove ad field
  const removeAd = (index) => {
    const newAds = formData.ads.filter((_, i) => i !== index);
    setFormData({ ...formData, ads: newAds });
  };

  const handleSubmit = async () => {
    try {
      // Ensure all ads have media URLs
      const hasEmptyMedia = formData.ads.some((ad) => !ad.mediaUrl);
      if (hasEmptyMedia) {
        alert("Please upload media for all ads before submitting.");
        return;
      }
  
      // Create a clean JSON-friendly object
      const newScreen = {
        name: formData.name.trim(),
        routeName: formData.routeName.trim(),
        layoutType: formData.layoutType.trim(),
        ads: formData.ads.map(({ title, mediaUrl }) => ({
          title: title.trim(),
          mediaUrl: mediaUrl.trim(),
        })),
      };
  
      // Axios POST request
      const response = await axios.post("http://localhost:3000/screens", newScreen, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Screen created successfully:", response.data);
      alert("Screen created successfully!");
  
      // Reset form after success
      setFormData({
        name: "",
        routeName: "",
        layoutType: "",
        ads: [{ title: "", mediaUrl: "" }],
      });
  
    } catch (error) {
      console.error("Error creating screen:", error);
      alert("Error creating screen. Please try again.");
    }
  };

  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f4f4f4"
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "400px" }}>
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          Create Screen
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Screen Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Route Name"
            name="routeName"
            variant="outlined"
            fullWidth
            value={formData.routeName}
            onChange={handleChange}
          />
          <TextField
            label="Layout Type"
            name="layoutType"
            variant="outlined"
            fullWidth
            value={formData.layoutType}
            onChange={handleChange}
          />

          <Typography variant="h6" fontWeight="bold">
            Ads
          </Typography>

          {formData.ads.map((ad, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{ p: 2, mb: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <TextField
                label="Ad Title"
                name="title"
                variant="outlined"
                fullWidth
                value={ad.title}
                onChange={(e) => handleAdChange(index, e)}
              />

              {/* File Upload Input */}
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Media
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(index, e.target.files[0])}
                />
              </Button>

              {/* Display uploaded file path */}
              {ad.mediaUrl && (
                <Typography variant="body2" color="textSecondary">
                  Uploaded: {ad.mediaUrl}
                </Typography>
              )}

              <Box display="flex" justifyContent="flex-end">
                <IconButton color="error" onClick={() => removeAd(index)} disabled={formData.ads.length === 1}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addAd}
            fullWidth
          >
            Add Another Ad
          </Button>

          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateScreen;
