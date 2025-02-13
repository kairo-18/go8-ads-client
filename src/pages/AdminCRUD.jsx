import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const AdminCRUD = () => {
  const navigate = useNavigate();

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh" 
      bgcolor="#f4f4f4"
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Admin CRUD Panel
      </Typography>
      
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, width: "320px" }}>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/crud/create")}
            fullWidth
          >
            Create Ad
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={() => navigate("/admin/crud/update")}
            fullWidth
          >
            Update Ad
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AdminCRUD;
