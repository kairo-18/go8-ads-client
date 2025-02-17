import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Grid,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../axios/axiosInstance";

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

function AdsTable({ ads, screenId }) {
    const [localAds, setLocalAds] = useState([]); // Renamed state
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);

    // Ensure state sync when the prop changes
    useEffect(() => {
        setLocalAds(ads);
    }, [ads]);

    const handleChangeAsset = (ad) => {
        setSelectedAd(ad);
        setOpenUploadModal(true);
    };

    const handleDeleteAd = (ad) => {
        setSelectedAd(ad);
        setOpenDeleteModal(true);
    };

    const handleUpdateAd = (ad) => {
        setSelectedAd(ad);
        setOpenUpdateModal(true);
    };

    const handleFileUpload = async (file) => {
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("ads", file);

        try {
            const response = await axiosInstance.post("/ads-upload", formData);
            if (!response.data.fileUrl) throw new Error("File upload failed");

            const updatedAd = {
                ...selectedAd,
                mediaUrl: response.data.fileUrl,
            };

            await axiosInstance.patch(
                `/screens/${screenId}/ads/${selectedAd.id}`,
                updatedAd
            );

            // ✅ Update the local state to reflect changes immediately
            setLocalAds((prevAds) =>
                prevAds.map((ad) => (ad.id === selectedAd.id ? updatedAd : ad))
            );

            alert("Ad updated successfully!");
            setOpenUploadModal(false);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const confirmDeleteAd = async () => {
        try {
            await axiosInstance.delete(
                `/screens/${screenId}/ads/${selectedAd.id}`
            );

            // ✅ Remove the deleted ad from state immediately
            setLocalAds((prevAds) =>
                prevAds.filter((ad) => ad.id !== selectedAd.id)
            );

            alert("Ad deleted successfully!");
            setOpenDeleteModal(false);
        } catch (error) {
            console.error("Error deleting ad:", error);
        }
    };

    const handleUpdateAdDetails = async () => {
        try {
            await axiosInstance.patch(
                `/screens/${screenId}/ads/${selectedAd.id}`,
                selectedAd
            );

            // ✅ Update the local state to reflect changes immediately
            setLocalAds((prevAds) =>
                prevAds.map((ad) => (ad.id === selectedAd.id ? selectedAd : ad))
            );

            alert("Ad updated successfully!");
            setOpenUpdateModal(false);
        } catch (error) {
            console.error("Error updating ad:", error);
        }
    };

    if (!localAds || localAds.length === 0) {
        return (
            <p className="text-gray-500 mt-4">
                No ads available for this screen.
            </p>
        );
    }

    return (
        <div className="mt-6 border rounded-lg shadow-md p-4 bg-white">
            <Typography variant="h5" className="font-bold mb-4">
                Ad Management
            </Typography>
            {localAds.map((ad, index) => {
                const formattedStartDate = new Date(
                    ad.startDate
                ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
                const formattedEndDate = new Date(
                    ad.endDate
                ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                return (
                    <div
                        key={index}
                        className="p-4 border-b flex justify-between items-center"
                    >
                        {ad.mediaUrl && (
                            <div className="mt-2">
                                {ad.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                    <img
                                        src={ad.mediaUrl}
                                        alt="Ad Preview"
                                        className="max-w-full h-auto rounded-lg shadow-sm"
                                        style={{ maxHeight: "200px" }}
                                    />
                                ) : ad.mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                                    <video
                                        controls
                                        src={ad.mediaUrl}
                                        className="max-w-full h-auto rounded-lg shadow-sm"
                                        style={{ maxHeight: "200px" }}
                                    />
                                ) : (
                                    <p className="text-gray-600">
                                        Unsupported file type for preview.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="ml-4 flex-grow">
                            <Typography variant="h6" className="font-semibold">
                                Title: {ad.title}
                            </Typography>
                            <Typography className="text-gray-600">
                                Start Date: {formattedStartDate}
                            </Typography>
                            <Typography className="text-gray-600">
                                End Date: {formattedEndDate}
                            </Typography>
                            <Typography className="text-gray-600">
                                Duration: {ad.duration}
                            </Typography>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleChangeAsset(ad)}
                                className="text-blue-500 border-blue-500"
                            >
                                Change asset
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleUpdateAd(ad)}
                                className="text-blue-500 border-blue-500"
                            >
                                Update
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteAd(ad)}
                                className="text-red-500 border-red-500"
                            >
                                Terminate ad
                            </Button>
                        </div>
                    </div>
                );
            })}

            {/* Upload Modal */}
            <Modal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
            >
                <Box
                    sx={modalStyle}
                    className="bg-white p-6 rounded-lg shadow-lg"
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        className="text-blue-500"
                    >
                        Upload New Asset
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon />}
                        className="mt-4 bg-blue-500 hover:bg-blue-700"
                    >
                        Upload File
                        <input
                            type="file"
                            accept="image/*,video/*"
                            hidden
                            onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                            }
                        />
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenUploadModal(false)}
                        className="mt-4 border-blue-500 text-blue-500 hover:bg-blue-100"
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <Box
                    sx={modalStyle}
                    className="bg-white p-6 rounded-lg shadow-lg"
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        className="text-red-500"
                    >
                        Confirm Delete
                    </Typography>
                    <Typography variant="body1" className="mt-2">
                        Are you sure you want to delete this ad?
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={confirmDeleteAd}
                        className="mt-4 bg-red-500 hover:bg-red-700"
                    >
                        Delete
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenDeleteModal(false)}
                        className="mt-4 border-red-500 text-red-500 hover:bg-red-100"
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            {/* Update Modal */}
            <Modal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
            >
                <Box
                    sx={modalStyle}
                    className="bg-white p-6 rounded-lg shadow-lg"
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        className="text-yellow-500"
                    >
                        Update Ad Details
                    </Typography>
                    <Grid container spacing={3} className="mt-4">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Ad Title"
                                value={selectedAd?.title || ""}
                                onChange={(e) =>
                                    setSelectedAd({
                                        ...selectedAd,
                                        title: e.target.value,
                                    })
                                }
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Slot"
                                value={selectedAd?.slot || ""}
                                onChange={(e) =>
                                    setSelectedAd({
                                        ...selectedAd,
                                        slot: e.target.value,
                                    })
                                }
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Duration"
                                type="number"
                                value={selectedAd?.duration || ""}
                                onChange={(e) =>
                                    setSelectedAd({
                                        ...selectedAd,
                                        duration: e.target.value,
                                    })
                                }
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateAdDetails}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-700"
                    >
                        Update
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenUpdateModal(false)}
                        className="mt-4 border-yellow-500 text-yellow-500 hover:bg-yellow-100"
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default AdsTable;
