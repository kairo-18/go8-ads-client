import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import Sidebar from "../SideBar";
import {
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    FormControl,
    Autocomplete,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../src/axios/axiosInstance";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

function CreateAd() {
    const [data, setData] = useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });

    const navigate = useNavigate();

    const [selectedScreens, setSelectedScreens] = useState([]);
    const [ads, setAds] = useState([]); // Initialize as an empty array

    const handleScreenChange = (screenId) => {
        setSelectedScreens((prevSelectedScreens) =>
            prevSelectedScreens.includes(screenId)
                ? prevSelectedScreens.filter((id) => id !== screenId)
                : [...prevSelectedScreens, screenId]
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get(
                    "/api/screens"
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

    const [layoutType, setLayoutType] = useState("Res1");
    const [adDetails, setAdDetails] = useState({
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
            const response = await axiosInstance.post("/api/ads-upload", formData);
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
            const screen = data.screens.find(
                (screen) => screen.id === screenId
            );
            return screen
                ? [{ layoutType: screen.layoutType, name: screen.name }]
                : [];
        });
        return layoutTypes.map((screen, index) => (
            <div key={index}>
                <img
                    src={`https://placehold.co/400x300?text=${screen.layoutType}`}
                    alt={screen.layoutType}
                />
                <h2>
                    {screen.layoutType} - {screen.name}
                </h2>
            </div>
        ));
    };

    const getSlotOptions = () => {
        const layoutTypes = selectedScreens.flatMap((screenId) => {
            const screen = data.screens.find(
                (screen) => screen.id === screenId
            );
            return screen ? screen.layoutType : [];
        });

        const uniqueLayoutTypes = [...new Set(layoutTypes)];

        if (uniqueLayoutTypes.length === 1) {
            switch (uniqueLayoutTypes[0]) {
                case "Res1":
                    return ["Side"];
                case "Res2":
                    return ["Upper", "Lower"];
                case "Res3":
                    return ["Side", "Bottom"];
                default:
                    return [];
            }
        }

        return [];
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />
            <div className="w-full h-screen p-10 bg-wgite">
                <div className="ml-64 flex flex-col gap-1 ">
                    <div className="flex justify-between flex-col items-start p-5">
                        <h1 className="font-bold text-2xl pb-5">Ad Settings</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Screens</CardTitle>
                        </CardHeader>
                        <CardContent>
                <Autocomplete
                    multiple // Enable multi-select
                    options={data.screens} // Pass the list of screens
                    getOptionLabel={(option) => option.name} // Display the screen name
                    value={data.screens.filter((screen) =>
                        selectedScreens.includes(screen.id)
                    )} // Filter selected screens
                    onChange={(event, newValue) => {
                        // Update the selected screens
                        const selectedIds = newValue.map((screen) => screen.id);
                        setSelectedScreens(selectedIds);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Screens"
                            placeholder="Choose screens"
                        />
                    )}
                />
            </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p
                                className={
                                    ads.length > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {ads.length > 0
                                    ? `${ads.length} ads found.`
                                    : "Inactive (No active ads)."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-4 border-b flex flex-row justify-between items-center">
                        <CardTitle>Start Advertising</CardTitle>
                        {/* Create Ad Button */}
                        <Button
                            onClick={handleCreateAd}
                            className=" w-[100px] bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Create Ad
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex justify-between justify-reverse items-start xl:flex-row flex-col gap-10">

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                {/* Left Column */}
                                <div className="space-y-5.5">
                                    <div>
                                        <Label htmlFor="title" className="block mb-2 font-medium">
                                            Add Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={adDetails.title}
                                            onChange={(e) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="w-full p-6 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="slot" className="block mb-2 font-medium">
                                            Slot
                                        </Label>
                                        <Autocomplete
                                            options={getSlotOptions()}
                                            getOptionLabel={(option) => option}
                                            value={adDetails.slot}
                                            onChange={(event, newValue) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    slot: newValue,
                                                })
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Slot"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="duration" className="block mb-2 font-medium">
                                            Duration (in seconds)
                                        </Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            value={adDetails.duration}
                                            onChange={(e) =>
                                                setAdDetails({
                                                    ...adDetails,
                                                    duration: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block mb-2 font-medium">Start Date</Label>
                                        <Popover>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Popover>
                                    </div>
                                    <div>
                                        <Label className="block mb-2 font-medium">End Date</Label>
                                        <Popover>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Popover>
                                    </div>
                                    <div>
                                        <Label htmlFor="file" className="block mb-2 font-medium">
                                            Upload File
                                        </Label>
                                        <div className="mt-1">
                                            <Input
                                                id="file"
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={(e) => handleFileUpload(e.target.files[0])}
                                                className="w-64 p-2 border rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Placeholder Images Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-wrap mt-4">
                                {getPlaceholderImages()}
                            </div>
                        </div>
                        

                        
                    </CardContent>
                </Card>
            </div>
                    </div>
                </div>
            </div>

        
    );
}

export default CreateAd;
