import React from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import DashboardStats from "../../components/Admin/DashboardStats";

function AdminPanel() {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 p-10 bg-[#F2E9E9] h-screen overflow-auto">
                <div className="ml-64 border border-[#d9d9d9] rounded-sm">
                    <h1 className="text-2xl font-bold p-5 ">Dashboard</h1>

                    <DashboardStats />

                    <div className="bg-[#F2E9E9] rounded-sm p-5">
                        <h2 className="text-lg">Preview</h2>
                        <div className="flex justify-between">
                            <ScreenPreview />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
