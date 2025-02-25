
import React, { useState, useEffect } from "react";
import DashboardStats from "../components/Admin/DashboardStats";
import { useNavigate } from "react-router-dom";
import IconMonitor from "@mui/icons-material/Monitor";
import Loading from "../components/loading/Loading";
import axiosInstance from "../axios/axiosInstance";

function Availability() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [screensData, setScreensData] = useState([]);
    const [activeFullScreen, setActiveFullScreen] = useState(0);
    const [activeScreens, setActiveScreens] = useState(0);
    const [inactiveScreens, setInactiveScreens] = useState(0);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchScreens = async () => {
            try {
                const response = await axiosInstance.get("/api/screens");
                setScreensData(response.data);

                const { fullScreenCount, activeCount, inactiveCount } = calculateScreenStats(response.data);
                setActiveFullScreen(fullScreenCount);
                setActiveScreens(activeCount);
                setInactiveScreens(inactiveCount);
            } catch (error) {
                console.error("Error fetching screens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScreens();
    }, []);

    const calculateScreenStats = (screens) => {
        let fullScreenCount = 0;
        let activeCount = 0;
        let inactiveCount = 0;

        screens.forEach((screen) => {
            const status = getScreenStatus(screen);

            if (status.includes("Full Screen")) {
                fullScreenCount++;
            } else if (status.includes("Active")) {
                activeCount++;
            } else {
                inactiveCount++;
            }
        });

        return { fullScreenCount, activeCount, inactiveCount };
    };

    const [selectedBuilding, setSelectedBuilding] = useState("screen1");
    const handleBuildingChange = (e) => setSelectedBuilding(e.target.value);

    const getScreenStatus = (screen) => {
        const totalSlots = 48; // 48 time slots (30 min each for a full 24-hour day)
        let occupiedSlots = new Set(); // Use a Set to store unique occupied slots

        const today = new Date().toISOString().split("T")[0];

        (screen.ads || []).forEach((ad) => {
            const adStart = new Date(ad.startDate);
            const adEnd = new Date(ad.endDate);

            const adStartDate = adStart.toISOString().split("T")[0]; 
            const adEndDate = adEnd.toISOString().split("T")[0];

            // Ignore ads that ended before today
            if (adEndDate < today) return;

            // If the ad is running today, calculate occupied time slots
            const startHour = adStart.getHours();
            const startMinute = adStart.getMinutes();
            const endHour = adEnd.getHours();
            const endMinute = adEnd.getMinutes();

            let startSlot = startHour * 2 + (startMinute >= 30 ? 1 : 0);
            let endSlot = endHour * 2 + (endMinute > 0 ? 1 : 0);

            // Ensure slots are within the 24-hour range
            startSlot = Math.max(startSlot, 0);
            endSlot = Math.min(endSlot, totalSlots);

            for (let i = startSlot; i < endSlot; i++) {
                occupiedSlots.add(i); // Add slot index to the Set
            }
        });

        const occupiedCount = occupiedSlots.size; // Get the number of unique slots used

        // Determine screen status based on occupied slots
        if (occupiedCount === totalSlots) {
            return `Active and Full Screen (${occupiedCount}/48)`;
        }
        if (occupiedCount > 0) {
            return `Active (${occupiedCount}/48)`;
        }
        return "Inactive";
    };




    const filteredScreens = screensData.filter((screen) => {
        const status = getScreenStatus(screen);
        return filter === "All" || status.includes(filter);
    });

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
                    <select className="border p-2 rounded" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Active and Full Screen">Active and Full Screen</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <DashboardStats />

                <div className="rounded-sm p-5">
                    <div className="border-[2px] border-gray-300 rounded-sm p-5">
                        <p className="text-sm font-bold text-gray-900 mb-4">Screens</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <select
                                className="border-3 border-blue-700 text-blue-700 rounded-sm p-2 w-1/5 "
                                value={selectedBuilding}
                                onChange={handleBuildingChange}
                            >
                                <option value="screen1">Building 1</option>
                            </select>
                            <p className="text-green-500 font-bold">Active and Full Screen: {activeFullScreen}</p>
                            <p className="text-blue-500 font-bold">Active Screens: {activeScreens}</p>
                            <p className="text-red-500 font-bold">Inactive Screens: {inactiveScreens}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 border-[2px] border-gray-300 rounded-sm mt-2">
                            {filteredScreens.length > 0 ? (
                                filteredScreens.map((screen, index) => (
                                    <ScreenCard
                                        key={index}
                                        title={screen.name || `Screen ${screen.id}`}
                                        place={screen.location || `Terminal ${index + 1}`}
                                        status={getScreenStatus(screen)}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 p-4">No screens available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ScreenCard = ({ title, place, status }) => {
    return (
        <div className="max-w-sm mt-2">
            <div className="flex justify-center">
                <IconMonitor style={{ fontSize: 90 }} />
            </div>
            <div className="pb-4 text-center">
            <h5 className={`text-sm font-semibold ${
            status.includes("Active and Full Screen") ? "text-green-500" :
            status.includes("Active") ? "text-blue-500" :
            "text-red-500"
        }`}>
            {status}
        </h5>

                <span className="text-sm text-gray-600">{title} - {place}</span>
            </div>
        </div>
    );
};

export default Availability;
