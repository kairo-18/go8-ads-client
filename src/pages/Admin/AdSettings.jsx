import React from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import Res1 from "../../components/Res1/Res1";
import Res2 from "../../components/Res2/Res2";
import Res3 from "../../components/Res3/Res3";
import { useNavigate } from "react-router-dom";
import AdsTable from "../../components/Admin/AdsTable";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";
import axiosInstance from "../../../src/axios/axiosInstance";


function AdSettings() {
    const [data, setData] = React.useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });

    const navigate = useNavigate();

    const [selectedScreen, setSelectedScreen] = React.useState("");
    const [ads, setAds] = React.useState([]); // Initialize as an empty array

    const showAdsOnScreen = (screenId) => {
        setSelectedScreen(screenId);
        const screen = data.screens.find((screen) => screen.id === screenId);
        setAds(screen ? screen.ads : []);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get(
                    "http://localhost:3000/api/screens"
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

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <div className="flex-1 w-full h-screen p-10 bg-white overflow-auto">
                <div className="ml-64 flex flex-col gap-1">
                    <div className="flex justify-between flex-col items-start p-5">
                        <h1 className="text-2xl font-bold ">Ad Settings</h1>

                        {/* Screen & Status Section */}
                        <div className="flex flex-wrap gap-10 md:gap-20 items-start">
                            <div>
                                <h3 className="font-bold text-sm pt-5 pb-2">Screens</h3>
                                {/* Material UI screen dropdown */}
                                <FormControl sx={{ minWidth: 300, "& .MuiOutlinedInput-root": { borderColor: "blue", "&:hover fieldset": { borderColor: "blue" }, "&.Mui-focused fieldset": { borderColor: "blue" } } }}>
                                    <InputLabel id="demo-simple-select-label">Screens</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
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

                            <div>
                                <h3 className="font-bold text-sm mt-2">Status</h3>
                                <p className="mt-3 text-red-500 text-lg">
                                    {ads.length > 0 ? `${ads.length} ads found.` : "Inactive (No active ads)."}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Create New Ad Button */}
                    <div className="flex justify-center flex-col items-end border-top border-[#d9d9d9]">
                        
                        <button
                            className="bg-blue-500 text-white px-5 py-2 rounded-lg mt-5 w-[289px]"
                            onClick={() => navigate("/admin/ad-setting/create-ad")}
                        >
                            Create New Ad
                        </button>
                    </div>

                        {/* Ads Table */}
                        <div className="mt-6 ">
                            <AdsTable ads={ads} screenId={selectedScreen} />
                        </div>
                </div>
            </div>
        </div>
    );
}

export default AdSettings;
