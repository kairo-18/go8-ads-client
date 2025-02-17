import React, { useEffect, useState, useContext } from "react";
import SideBar from "../pages/SideBar";
import ScreenPreview from "../components/Admin/ScreenPreview"
import DashboardStats from "../components/Admin/DashboardStats";
import { useNavigate } from "react-router-dom";

function Availability() {
    const navigate = useNavigate();
    const [data, setData] = useState({ screens: [], ads: [], displayedAds: 0 });

    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 p-10 bg-[#F2E9E9] h-screen overflow-auto">
                <div className="ml-64 border border-[#d9d9d9] rounded-sm">
                    <h1 className="text-2xl font-bold p-5 ">Availability</h1>

                    <DashboardStats/>

                    <div className="bg-[#F2E9E9] rounded-sm p-5">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Availability;
