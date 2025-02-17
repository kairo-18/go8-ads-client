import React, { useEffect, useState, useContext } from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import DashboardStats from "../../components/Admin/DashboardStats";  // Import the new component
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../axios/axiosInstance';

function AdminPanel() {
    const navigate = useNavigate();
    const [data, setData] = useState({ screens: [], ads: [], displayedAds: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get('http://localhost:3000/screens');
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
    }, []);

    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 p-10 bg-[#F2E9E9] h-screen overflow-auto">
                <div className="ml-64 border border-[#d9d9d9] rounded-sm">
                    <h1 className="text-2xl font-bold p-5 ">Dashboard</h1>

                    <DashboardStats
                        screens={data.screens}
                        ads={data.ads}
                        displayedAds={data.displayedAds}
                    />

                    <div className="bg-[#F2E9E9] rounded-sm p-5">
                        <h2 className="text-lg">Preview</h2>
                        <div className="flex justify-between">
                            <ScreenPreview screens={data.screens} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
