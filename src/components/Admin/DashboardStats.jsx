import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import icon_PostAds from "../../assets/adminPanel/icon_PostAds.png";

const DashboardStats = ({ screenRefreshTrigger }) => {
    const [data, setData] = useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get("/api/screens");
                const allAds = screensResponse.data.flatMap((screen) => screen.ads || []);

                // Get today's date in YYYY-MM-DD format
                const today = new Date().toISOString().split('T')[0];

                // Filter ads that are active today (today is between startDate and endDate)
                const todaysAds = allAds.filter(ad => {
                    if (!ad.startDate || !ad.endDate) return false; // Skip if startDate or endDate is missing

                    try {
                        const startDate = new Date(ad.startDate).toISOString().split('T')[0];
                        const endDate = new Date(ad.endDate).toISOString().split('T')[0];

                        // Check if today is between startDate and endDate (inclusive)
                        return today >= startDate && today <= endDate;
                    } catch (error) {
                        console.error("Invalid date format for ad:", ad);
                        return false; // Skip if the date is invalid
                    }
                });

                setData({
                    screens: screensResponse.data,
                    ads: allAds,
                    displayedAds: todaysAds.length, // Only count ads active today
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [screenRefreshTrigger]);

    return (
        <div className="flex flex-wrap p-4 px-6 mx-5 text-md border border-[#d9d9d9] rounded-sm">
            <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4 mb-4 sm:mb-0">
                <h2>
                    🖥️ Active Screens <span className="float-right">{data.screens.length}</span>
                </h2>
            </div>
            <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4 mb-4 sm:mb-0">
                <h2>
                    <img src={icon_PostAds} alt="Post Ads Icon" className="size-6 inline-block mr-2" />
                    Active Ads <span className="float-right">{data.ads.length}</span>
                </h2>
            </div>
            <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mb-4 sm:mb-0">
                <h2 className="text-md">
                    🖥️ Scheduled Ads Today <span className="float-right">{data.displayedAds}</span>
                </h2>
            </div>
        </div>
    );
};

export default DashboardStats;
