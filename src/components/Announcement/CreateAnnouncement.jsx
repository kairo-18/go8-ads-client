import { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl,  } from "@mui/material";
import axiosInstance from "../../axios/axiosInstance";
import socket from "../../socket-config/socket"

const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    flightNumber: "",
    gate: "",
    duration: "",
    active: true,
    screenIds: [], 
    announcementType:""// Added screenIds to the form data
  });

  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
 

  // Fetch available screens
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await axiosInstance.get("/api/screens");
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
  
      // Step 2: Emit the 'createAnnouncement' event to WebSocket server
      socket.emit('createAnnouncement', {
        title: formData.title,
        message: formData.message,
        flightNumber: formData.flightNumber,
        gate: formData.gate,
        duration: formData.duration,
        screenIds: formData.screenIds,
        announcementType: formData.announcementType  // Send screen IDs to WebSocket server
      });

      alert("Announcement created successfully!");

      setFormData({
        title: "",
        message: "",
        flightNumber: "",
        gate: "",
        duration: "",
        active: true,
        screenIds: [],
        announcementType: "" // Reset screenIds
      });
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5">
            Create Announcement
          </Typography>
        <div className="text-[#282828] font-bold flex gap-5">
          <div className="flex flex-col w-full">
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
              label="Flight Number"
              name="flightNumber"
              value={formData.flightNumber}
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
              rows={4.5}
              margin="normal"
            />
  
          <FormControl fullWidth>
      <InputLabel id="announcementType-label">Select the type of announcement</InputLabel>
      <Select
        labelId="announcementType-label"
        id="announcementType"
        name="announcementType"
        value={formData.announcementType}
        onChange={(event) => setFormData({ ...formData, announcementType: event.target.value })}
      >
        <MenuItem value="Screen Takeover">Screen Takeover</MenuItem>
        <MenuItem value="Marquee">Marquee</MenuItem>
      </Select>
    </FormControl>
          </div>

          <div className="flex flex-col w-full">
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
            <TextField
              fullWidth
              label="Gate (Optional)"
              name="gate"
              value={formData.gate}
              onChange={handleChange}
              margin="normal"
            />
            <div className="flex justify-between pt-10">
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
              <div className="w-64">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Create Announcement"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
      </Box>
    </Container>
  );
};

export default CreateAnnouncement;
