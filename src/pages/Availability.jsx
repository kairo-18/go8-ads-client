import React, { useState, useEffect } from "react";
import DashboardStats from "../components/Admin/DashboardStats";
import { useNavigate } from "react-router-dom";
import IconMonitor from "@mui/icons-material/Monitor";
import Loading from "../components/loading/Loading";

function Availability() {
    const navigate = useNavigate();
    const [selectedBuilding, setSelectedBuilding] = useState("screen1");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const activeFullScreen = 20;
    const activeScreens = 10;
    const inactiveScreens = 5;

    const stateColors = {
        "Active and Full (2/2)": "text-green-500",
        "Active (1/2)": "text-blue-500",
        "Inactive": "text-red-500",
    };

    const ScreenCard = ({ state, title, place }) => {
        const stateClass = stateColors[state] || "";

        return (
            <div className="max-w-sm mt-2">
                <div className="flex justify-center">
                    <IconMonitor style={{ fontSize: 90 }} />
                </div>
                <div className="pb-4 text-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex flex-col">
                            <h5 className={`text-sm font-semibold ${stateClass}`}>{state}</h5>
                            <span className="text-sm text-gray-600">{title} - {place}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleBuildingChange = (e) => {
        setSelectedBuilding(e.target.value);
    };

    const buildingScreens = {
        screen1: [
            { state: "Active and Full (2/2)", title: "Screen 1", place: "Lobby" },
            { state: "Active and Full (2/2)", title: "Screen 2", place: "Terminal 1" },
            { state: "Active and Full (2/2)", title: "Screen 3", place: "Terminal 2" },
            { state: "Active (1/2)", title: "Screen 4", place: "Terminal 3" },
            { state: "Active (1/2)", title: "Screen 5", place: "Terminal 4" },
            { state: "Active (1/2)", title: "Screen 6", place: "Terminal 5" },
            { state: "Inactive", title: "Screen 7", place: "Terminal 6" },
            { state: "Inactive", title: "Screen 8", place: "Terminal 7" },
            { state: "Inactive", title: "Screen 9", place: "Terminal 8" },
            { state: "Inactive", title: "Screen 10", place: "Terminal 10" },
        ],
        screen2: [
            { state: "Inactive", title: "Screen 1", place: "Lobby" },
            { state: "Active (1/2)", title: "Screen 2", place: "Terminal 1" },
        ],
        screen3: [
            { state: "Inactive", title: "Screen 1", place: "Lobby" },
            { state: "Inactive", title: "Screen 2", place: "Terminal 1" },
            { state: "Inactive", title: "Screen 3", place: "Terminal 2" },
            { state: "Inactive", title: "Screen 4", place: "Terminal 3" },
        ]
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-white">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-10 bg-white">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center p-5">
                    <h1 className="font-bold text-2xl pb-5">Availability</h1>
                </div>
                <DashboardStats />

                <div className="rounded-sm p-5">
                    <div className="border-2 border-gray-300 rounded-sm p-5">
                        <p className="text-sm font-bold text-gray-900 mb-4">Screens</p>
                        <div className="flex flex-wrap items-center justify-between">
                            <select
                                className="border-3 border-blue-700 text-blue-700 rounded-sm p-2 w-1/5"
                                value={selectedBuilding}
                                onChange={handleBuildingChange}
                            >
                                <option value="screen1">Building 1</option>
                                <option value="screen2">Building 2</option>
                                <option value="screen3">Building 3</option>
                            </select>
                            <div className="flex flex-wrap gap-4">
                                <p className="text-green-500 font-bold">Active and Full Screen: {activeFullScreen}</p>
                                <p className="text-blue-500 font-bold">Active Screens: {activeScreens}</p>
                                <p className="text-red-500 font-bold">Inactive Screens: {inactiveScreens}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 border-2 border-gray-300 rounded-sm mt-2">
                            {buildingScreens[selectedBuilding].map((screen, index) => (
                                <ScreenCard
                                    key={index}
                                    state={screen.state}
                                    title={screen.title}
                                    place={screen.place}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Availability;
