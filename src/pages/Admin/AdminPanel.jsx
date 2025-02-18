import React from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import DashboardStats from "../../components/Admin/DashboardStats";

function AdminPanel() {
    return (
        <div className="flex">
            <SideBar />
            <div className="w-full h-screen p-10 bg-wgite">
                <div className="ml-64 flex flex-col gap-1 ">
                    <div className="flex justify-between items-center p-5">
                        <h1 className="font-bold text-2xl pb-5">Dashboard</h1>
                        
                    </div>
                    <DashboardStats />
                    <div className=" rounded-sm p-5">
                        <h1 className=" font-bold text-lg">Preview</h1>
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
