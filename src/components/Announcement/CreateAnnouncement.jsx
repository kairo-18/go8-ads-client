import { useState } from "react";
import { TextField, Button, Container, Typography, Box, FormControlLabel, Switch } from "@mui/material";
import axios from "axios";

const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    flightNumber: "",
    gate: "",
    duration: "",
    active: true, // ✅ Added active status
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/announcements", {
        ...formData,
        duration: Number(formData.duration),
      });
      alert("Announcement created successfully!");
      setFormData({
        title: "",
        message: "",
        flightNumber: "",
        gate: "",
        duration: "",
        active: true, // Reset to active by default
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

          {/* ✅ Add Active Status Toggle */}
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
