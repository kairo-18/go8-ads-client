import React, { useEffect, useState, useContext } from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import Res1 from "../../components/Res1/Res1";
import Res2 from "../../components/Res2/Res2";
import Res3 from "../../components/Res3/Res3";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../axios/axiosInstance';
import icon_PostAds from "../../assets/adminPanel/icon_PostAds.png";


function AdminPanel() {
    const navigate = useNavigate();
    const [data, setData] = useState({ screens: [], ads: [], displayedAds: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get('http://localhost:3000/screens');


                // Extract ads from screens since there's no direct GET /ads route
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
    }, []); // Add data as a dependency

    return (
        <div className="">
            <SideBar />
            <div className="w-full h-screen p-10 bg-[#F2E9E9] ">
                <div className="ml-64 border border-[#d9d9d9] pb-10 rounded-sm ">
                    <h1 className="text-2xl font-bold p-5 pb-10">Dashboard</h1>

                    <div className="flex flex-wrap p-4 px-6 mx-5 text-md border border-[#d9d9d9] rounded-sm">
                        <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4">
                            <h2> 🖥️ Active Screens <span className="float-right">{data.screens.length}</span></h2>
                        </div>
                        <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4">
                            <h2>
                            <img src={icon_PostAds} alt="Post Ads Icon" className="size-6 inline-block mr-2" />
                            Active Ads <span className="float-right">{data.ads.length}</span>
                            </h2>
                        </div>
                        <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded">
                            <h2 className="text-md">🖥️ Displayed Ads <span className="float-right">{data.displayedAds}</span></h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
