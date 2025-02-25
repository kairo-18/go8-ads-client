import React, { useEffect, useState } from "react";
import axiosInstance from "../../../src/axios/axiosInstance";
import Res1 from "../Res1/Res1";
import Res2 from "../Res2/Res2";
import Res3 from "../Res3/Res3";
import Res4 from "../Res4/Res4";
import { useNavigate } from "react-router-dom";

function ScreenPreview({ screenRefreshTrigger, isDeleting, selectedScreens, setSelectedScreens, mutedVideo }) {
    const [data, setData] = useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });

    const navigate = useNavigate();

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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [screenRefreshTrigger]);

    const handleScreenSelect = (screenId) => {
        setSelectedScreens((prev) =>
            prev.includes(screenId) ? prev.filter((id) => id !== screenId) : [...prev, screenId]
        );
    };

    const calculateActiveAds = (screen) => {
        const totalAds = screen.layoutType === "Res1" ? 12 : 24;
        let activeAds = 0;
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));

        (screen.ads || []).forEach((ad) => {
            const start = new Date(ad.startDate);
            const end = new Date(ad.endDate);

            if (start.getTime() !== today.getTime() && end < todayStart) {
                return; // Skip ads that ended before today
            }

            const effectiveStart = start < todayStart ? todayStart : start;
            const effectiveEnd = end > todayEnd ? todayEnd : end;
            const durationHours = (effectiveEnd - effectiveStart) / (1000 * 60 * 60);
            activeAds += Math.ceil(durationHours / 2);
        });

        let statusColor = "text-red-500";
        if (activeAds === totalAds) {
            statusColor = "text-green-500";
        } else if (activeAds > 0) {
            statusColor = "text-yellow-500";
        }

        return (
            <span className={`text-sm ${statusColor}`}>
                {activeAds > 0 ? `Status: ${activeAds} out of ${totalAds} time slots taken` : "No active ads"}
            </span>
        );
    };

    return (
        <div className="w-full h-full border border-[#d9d9d9] rounded-sm p-5 mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {data.screens.map((screen, index) => (
                    <div
                        key={index}
                        className={`w-full border rounded-lg p-2 bg-[#FFFFFF] shadow-md flex flex-col justify-center items-center overflow-hidden h-70 ${
                            isDeleting && selectedScreens.includes(screen.id) ? "border-red-500" : ""
                        }`}
                        onClick={isDeleting ? () => handleScreenSelect(screen.id) : undefined}
                    >
                        <div
                            className="relative h-full flex justify-center items-center"
                            style={{ transform: "scale(0.25)", transformOrigin: "center" }}
                        >
                            {screen.layoutType === "Res1" ? (
                                <Res1 screenId={screen.id} />
                            ) : screen.layoutType === "Res2" ? (
                                <Res2 screenId={screen.id} />
                            ) : screen.layoutType === "Res3" ? (
                                <Res3 screenId={screen.id} />
                            ) : screen.layoutType === "Res4" ? (
                                <Res4 screenId={screen.id} mutedVideo={mutedVideo} />
                            ) : null
                            }
                        </div>
                        <div className="flex justify-between items-center w-full px-2 -mt-5">
                            {calculateActiveAds(screen)}
                            <button className="text-blue-500 underline" onClick={() => navigate(`/${screen.routeName}`)}>
                                {screen.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ScreenPreview;
