import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdsTable from "../../components/Admin/AdsTable";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axiosInstance from "../../../src/axios/axiosInstance";
import Loading from "../../components/loading/Loading"; 

function AdSettings() {
    const [data, setData] = useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedScreen, setSelectedScreen] = useState("");
    const [ads, setAds] = useState([]);

    const showAdsOnScreen = (screenId) => {
        setSelectedScreen(screenId);
        const screen = data.screens.find((screen) => screen.id === screenId);
        setAds(screen ? screen.ads : []);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get("/api/screens");
                const allAds = screensResponse.data.flatMap((screen) => screen.ads || []);

                setData({
                    screens: screensResponse.data,
                    ads: allAds,
                    displayedAds: allAds.reduce((acc, ad) => acc + (ad.displayCount || 0), 0),
                });

                setLoading(false); // Set loading to false when data is ready
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Prevent infinite loading on error
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-white">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-10 bg-white overflow-auto">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start p-5">
                    <h1 className="text-2xl font-bold">Ad Settings</h1>
                </div>

                {/* Screen, Status, and Create New Ad Button Section */}
                <div className="flex flex-wrap justify-between items-center p-5">
                    {/* Screens and Status Sections */}
                    <div className="flex flex-wrap gap-10 md:gap-20 items-center">
                        {/* Screens Section */}
                        <div>
                            <h3 className="font-bold text-sm pt-5 pb-2">Screens</h3>
                            <FormControl sx={{ minWidth: 300, "& .MuiOutlinedInput-root": { borderColor: "blue", "&:hover fieldset": { borderColor: "blue" }, "&.Mui-focused fieldset": { borderColor: "blue" } } }}>
                                <InputLabel id="screen-select-label">Screens</InputLabel>
                                <Select
                                    labelId="screen-select-label"
                                    id="screen-select"
                                    value={selectedScreen}
                                    onChange={(event) => showAdsOnScreen(event.target.value)}
                                >
                                    {data.screens.map((screen) => (
                                        <MenuItem key={screen.id} value={screen.id}>
                                            {screen.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Status Section */}
                        <div>
                            <h3 className="font-bold text-sm mt-2">Status</h3>
                            <p className="mt-3 text-red-500 text-lg">
                                {ads.length > 0 ? `${ads.length} ads found.` : "Inactive (No active ads)."}
                            </p>
                        </div>
                    </div>

                    {/* Create New Ad Button */}
                    <div className="flex items-center pt-5">
                        <button
                            className="bg-blue-500 text-white px-5 py-2 rounded-lg"
                            onClick={() => navigate("/admin/ad-setting/create-ad")}
                        >
                            Create New Ad
                        </button>
                    </div>
                </div>

                {/* Ads Table */}
                <div className="mt-6 border-t border-gray-200 pt-5">
                    <AdsTable ads={ads} screenId={selectedScreen} />
                </div>
            </div>
        </div>
    );
}

export default AdSettings;
