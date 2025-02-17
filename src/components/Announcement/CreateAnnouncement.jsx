import { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import axiosInstance from "../../axios/axiosInstance";
import { io } from "socket.io-client";

const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    flightNumber: "",
    gate: "",
    duration: "",
    active: true,
    screenIds: [], // Added screenIds to the form data
  });

  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = io("http://localhost:3000");  // Connect to WebSocket server

  // Fetch available screens
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/screens");
        setScreens(response.data || []);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle screen selection changes
  const handleScreenChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      screenIds: value,  // Handle multiple screen IDs
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create the announcement via API
      const response = await axios.post("http://localhost:3000/announcements", {
        ...formData,
        duration: Number(formData.duration),
      });

      // Step 2: Emit the 'createAnnouncement' event to WebSocket server
      socket.emit('createAnnouncement', {
        title: formData.title,
        message: formData.message,
        flightNumber: formData.flightNumber,
        gate: formData.gate,
        duration: formData.duration,
        screenIds: formData.screenIds,  // Send screen IDs to WebSocket server
      });

      alert("Announcement created successfully!");

      setFormData({
        title: "",
        message: "",
        flightNumber: "",
        gate: "",
        duration: "",
        active: true,
        screenIds: [], // Reset screenIds
      });
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={2}>
          Create Announcement
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Flight Number"
            name="flightNumber"
            value={formData.flightNumber}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Gate (Optional)"
            name="gate"
            value={formData.gate}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Duration (seconds)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Screen Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="screen-select-label">Select Screens</InputLabel>
            <Select
              labelId="screen-select-label"
              multiple
              value={formData.screenIds}
              onChange={handleScreenChange}
              name="screenIds"
              renderValue={(selected) => selected.join(", ")}
            >
              {screens.map((screen) => (
                <MenuItem key={screen.id} value={screen.id}>
                  {screen.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Active Status Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={handleChange}
                name="active"
              />
            }
            label="Active"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Announcement"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateAnnouncement;
