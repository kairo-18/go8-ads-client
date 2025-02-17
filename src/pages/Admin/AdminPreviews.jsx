import React from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import Res1 from "../../components/Res1/Res1";
import Res2 from "../../components/Res2/Res2";
import Res3 from "../../components/Res3/Res3";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../../components/Admin/DashboardStats";

function AdminPanel() {
    return (
        <div className="">
            <SideBar />
            <div className="w-full h-screen p-10 bg-gray-50">
                <div className="ml-64 flex flex-col gap-1">
                    <h1 className="font-bold text-2xl">Previews</h1>
                    <DashboardStats />
                    <ScreenPreview />
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
