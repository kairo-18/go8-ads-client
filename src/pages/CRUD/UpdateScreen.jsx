import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import UploadIcon from "@mui/icons-material/Upload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const UpdateScreen = () => {
    const [screens, setScreens] = useState([]);

    useEffect(() => {
        fetchScreens();
    }, []);

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
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            alert("Screen updated successfully!");
            fetchScreens();
        } catch (error) {
            console.error("Error updating screen:", error);
        }
    };

    const handleFileUpload = async (screenIndex, adIndex, file) => {
        if (!file) return alert("Please select a file");
        const formData = new FormData();
        formData.append("ads", file);

        try {
            const response = await fetch("http://localhost:3000/ads-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("File upload failed");
            const result = await response.json();

            const updatedScreens = [...screens];
            updatedScreens[screenIndex].ads[adIndex].mediaUrl = result.fileUrl;
            setScreens(updatedScreens);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const getDisabledDates = (screenIndex, currentAdIndex) => {
        const disabledDates = screens[screenIndex].ads
            .filter((_, index) => index !== currentAdIndex)
            .flatMap((ad) => {
                if (ad.startDate && ad.endDate) {
                    return [
                        { start: dayjs(ad.startDate), end: dayjs(ad.endDate) },
                    ];
                }
                return [];
            });
        return disabledDates;
    };

    const isTimeDisabled = (screenIndex, currentAdIndex, newDate) => {
        const { layoutType } = screens[screenIndex];
        const disabledRanges = getDisabledDates(screenIndex, currentAdIndex);

        if (layoutType === "Res1") {
            // Strict: No overlapping ads allowed
            return disabledRanges.some(
                ({ start, end }) =>
                    newDate.isAfter(start) && newDate.isBefore(end)
            );
        }

        if (layoutType === "Res2" || layoutType === "Res3") {
            // Allow up to 2 overlapping ads
            let overlapCount = disabledRanges.filter(
                ({ start, end }) =>
                    newDate.isAfter(start) && newDate.isBefore(end)
            ).length;

            return overlapCount >= 2; // Disable if more than 2 overlaps
        }

        return false;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg" className="py-8">
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    className="font-bold"
                >
                    Update Screens
                </Typography>
                {screens.map((screen, screenIndex) => (
                    <Paper key={screen.id} elevation={3} className="p-6 mb-6">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Screen Name"
                                    value={screen.name}
                                    onChange={(e) => {
                                        const newScreens = [...screens];
                                        newScreens[screenIndex].name =
                                            e.target.value;
                                        setScreens(newScreens);
                                    }}
                                    variant="outlined"
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Route Name"
                                    value={screen.routeName}
                                    onChange={(e) => {
                                        const newScreens = [...screens];
                                        newScreens[screenIndex].routeName =
                                            e.target.value;
                                        setScreens(newScreens);
                                    }}
                                    variant="outlined"
                                    className="mb-4"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Layout Type"
                                value={screen.layoutType || ""}
                                onChange={(e) => {
                                    const newScreens = [...screens];
                                    newScreens[screenIndex].layoutType =
                                        e.target.value;
                                    setScreens(newScreens);
                                }}
                                variant="outlined"
                                className="mb-4"
                            />
                        </Grid>

                        <Typography
                            variant="h6"
                            component="h2"
                            gutterBottom
                            className="mt-4 font-semibold"
                        >
                            Ads
                        </Typography>
                        {screen.ads.map((ad, adIndex) => (
                            <Box key={ad.id} className="mb-4">
                                <Box className="flex items-center gap-4 mb-4">
                                    <TextField
                                        fullWidth
                                        label="Ad Title"
                                        value={ad.title}
                                        onChange={(e) => {
                                            const newScreens = [...screens];
                                            newScreens[screenIndex].ads[
                                                adIndex
                                            ].title = e.target.value;
                                            setScreens(newScreens);
                                        }}
                                        variant="outlined"
                                    />
                                    <Button
                                        variant="contained"
                                        component="label"
                                        className="flex-grow"
                                        startIcon={<UploadIcon />}
                                    >
                                        Upload File
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            hidden
                                            onChange={(e) =>
                                                handleFileUpload(
                                                    screenIndex,
                                                    adIndex,
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </Button>
                                    <IconButton
                                        onClick={() => {
                                            const newScreens = [...screens];
                                            newScreens[screenIndex].ads.splice(
                                                adIndex,
                                                1
                                            );
                                            setScreens(newScreens);
                                        }}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                <Box mb={4}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DateTimePicker
                                            label="Start Date"
                                            value={
                                                ad.startDate
                                                    ? dayjs(ad.startDate)
                                                    : null
                                            }
                                            onChange={(newDate) => {
                                                if (
                                                    isTimeDisabled(
                                                        screenIndex,
                                                        adIndex,
                                                        newDate
                                                    )
                                                )
                                                    return;
                                                const newScreens = [...screens];
                                                newScreens[screenIndex].ads[
                                                    adIndex
                                                ].startDate =
                                                    newDate.toISOString();
                                                setScreens(newScreens);
                                            }}
                                            shouldDisableTime={(newDate) =>
                                                isTimeDisabled(
                                                    screenIndex,
                                                    adIndex,
                                                    newDate
                                                )
                                            }
                                        />

                                        <DateTimePicker
                                            label="End Date"
                                            value={
                                                ad.endDate
                                                    ? dayjs(ad.endDate)
                                                    : null
                                            }
                                            onChange={(newDate) => {
                                                if (
                                                    isTimeDisabled(
                                                        screenIndex,
                                                        adIndex,
                                                        newDate
                                                    )
                                                )
                                                    return;
                                                const newScreens = [...screens];
                                                newScreens[screenIndex].ads[
                                                    adIndex
                                                ].endDate =
                                                    newDate.toISOString();
                                                setScreens(newScreens);
                                            }}
                                            shouldDisableTime={(newDate) =>
                                                isTimeDisabled(
                                                    screenIndex,
                                                    adIndex,
                                                    newDate
                                                )
                                            }
                                        />
                                    </LocalizationProvider>
                                </Box>

                                {/* Preview Section */}
                                {ad.mediaUrl && (
                                    <Box className="mt-4">
                                        <Typography
                                            variant="body1"
                                            className="font-medium mb-2"
                                        >
                                            Preview:
                                        </Typography>
                                        {ad.mediaUrl.match(
                                            /\.(jpeg|jpg|gif|png)$/
                                        ) ? (
                                            <img
                                                src={ad.mediaUrl}
                                                alt="Uploaded Ad Preview"
                                                className="max-w-full h-auto rounded-lg shadow-sm"
                                                style={{ maxHeight: "200px" }}
                                            />
                                        ) : ad.mediaUrl.match(
                                              /\.(mp4|webm|ogg)$/
                                          ) ? (
                                            <video
                                                controls
                                                src={ad.mediaUrl}
                                                className="max-w-full h-auto rounded-lg shadow-sm"
                                                style={{ maxHeight: "200px" }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                className="text-gray-600"
                                            >
                                                Unsupported file type for
                                                preview.
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        ))}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const newScreens = [...screens];
                                newScreens[screenIndex].ads.push({
                                    title: "",
                                    mediaUrl: "",
                                });
                                setScreens(newScreens);
                            }}
                            className="mt-4"
                        >
                            Add Ad
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            className="mt-4 ml-4"
                            onClick={() =>
                                handleUpdateScreen(screen.id, screen)
                            }
                        >
                            Update Screen
                        </Button>
                    </Paper>
                ))}
            </Container>
        </LocalizationProvider>
    );
};

export default UpdateScreen;
