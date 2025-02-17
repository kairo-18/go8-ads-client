import React from "react";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "../../../src/axios/axiosInstance";
import {
    Button,
    TextField,
    Grid,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

function CreateAd() {
    const [data, setData] = React.useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });

    const navigate = useNavigate();

    const [selectedScreens, setSelectedScreens] = React.useState([]);
    const [ads, setAds] = React.useState([]); // Initialize as an empty array

    const handleScreenChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedScreens(
            typeof value === "string" ? value.split(",") : value
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get(
                    "http://localhost:3000/screens"
                );

                // Extract ads from screens since there's no direct GET /ads route
                const allAds = screensResponse.data.flatMap(
                    (screen) => screen.ads || []
                );

                setData({
                    screens: screensResponse.data,
                    ads: allAds,
                    displayedAds: allAds.reduce(
                        (acc, ad) => acc + (ad.displayCount || 0),
                        0
                    ),
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const selectedAds = data.screens
            .filter((screen) => selectedScreens.includes(screen.id))
            .flatMap((screen) => screen.ads || []);
        setAds(selectedAds);
    }, [selectedScreens, data.screens]);

    const [layoutType, setLayoutType] = React.useState("Res1");
    const [adDetails, setAdDetails] = React.useState({
        title: "",
        slot: "",
        startDate: null,
        endDate: null,
        duration: "",
        mediaUrl: "",
    });

    const handleFileUpload = async (file) => {
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("ads", file);

        try {
            const response = await axiosInstance.post("/ads-upload", formData);
            if (!response.data.fileUrl) throw new Error("File upload failed");

            setAdDetails((prevDetails) => ({
                ...prevDetails,
                mediaUrl: response.data.fileUrl,
            }));

            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleCreateAd = async () => {
        try {
            await Promise.all(
                selectedScreens.map((screenId) =>
                    axiosInstance.post(`/screens/${screenId}/ads`, adDetails)
                )
            );
            alert("Ad created successfully!");
        } catch (error) {
            console.error("Error creating ad:", error);
        }
    };

    const getPlaceholderImages = () => {
        const layoutTypes = selectedScreens.flatMap((screenId) => {
            const screen = data.screens.find((screen) => screen.id === screenId);
            return screen ? [{ layoutType: screen.layoutType, name: screen.name }] : [];
        });
        return layoutTypes.map((screen, index) => (
            <div key={index}>
                <img
                    src={`https://placehold.co/400x300?text=${screen.layoutType}`}
                    alt={screen.layoutType}
                />
                <h2>{screen.layoutType} - {screen.name}</h2>
            </div>
        ));
    };

    return (
        <div>
            <SideBar />
            <div className="w-full h-screen p-10 bg-gray-50">
                <div className="ml-64">
                    <h1 className="font-bold text-2xl">Ad Settings</h1>

                    <div className="flex gap-20">
                        <div>
                            <h3 className="font-bold text-xl mt-10">Screens</h3>
                            {/* Material UI screen multiple select */}
                            <FormControl sx={{ minWidth: 300 }}>
                                <InputLabel id="multiple-screens-label">
                                    Screens
                                </InputLabel>
                                <Select
                                    labelId="multiple-screens-label"
                                    id="multiple-screens"
                                    multiple
                                    value={selectedScreens}
                                    onChange={handleScreenChange}
                                    renderValue={(selected) =>
                                        selected
                                            .map(
                                                (screenId) =>
                                                    data.screens.find(
                                                        (screen) =>
                                                            screen.id ===
                                                            screenId
                                                    )?.name
                                            )
                                            .join(", ")
                                    }
                                >
                                    {data.screens.map((screen) => (
                                        <MenuItem key={screen.id} value={screen.id}>
                                            <Checkbox
                                                checked={selectedScreens.includes(
                                                    screen.id
                                                )}
                                            />
                                            {screen.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mt-10">Status</h3>
                            <p className="mt-3 text-red-500">
                                {ads.length > 0
                                    ? `${ads.length} ads found.`
                                    : "Inactive (No active ads)."}
                            </p>
                        </div>
                    </div>

                    <div className="">
                        {/* Button for creating a new ad  */}
                        <hr className="mt-5" />

                        <h1 className="text-xl font-light mt-5">
                            Start Advertising
                        </h1>
                        {/* select new layout type  */}
                        <div className="flex gap-5">
                            {getPlaceholderImages()}
                        </div>

                        <div className="mt-10">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Ad Title"
                                            value={adDetails.title}
                                            onChange={(e) =>
                                                setAdDetails({
                                                    ...adDetails,
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
                                            value={adDetails.slot}
                                            onChange={(e) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    slot: e.target.value,
                                                })
                                            }
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DateTimePicker
                                            label="Start Date"
                                            value={adDetails.startDate}
                                            onChange={(newDate) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    startDate: newDate,
                                                })
                                            }
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DateTimePicker
                                            label="End Date"
                                            value={adDetails.endDate}
                                            onChange={(newDate) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    endDate: newDate,
                                                })
                                            }
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Duration"
                                            type="number"
                                            value={adDetails.duration}
                                            onChange={(e) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    duration: e.target.value,
                                                })
                                            }
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload File
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                hidden
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateAd}
                                className="mt-4"
                            >
                                Create Ad
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAd;
