import React, { useState } from "react";
import SideBar from "../SideBar";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import DashboardStats from "../../components/Admin/DashboardStats";
import ScreenCreate from "../../components/Admin/ScreenCreate";

function AdminPreviews() {
    const [screenRefreshTrigger, setScreenRefreshTrigger] = useState(false);

    // Function to toggle the refresh trigger
    const refreshScreens = () => {
        setScreenRefreshTrigger((prev) => !prev);
    };

    return (
        <div className="">
            <SideBar />
            <div className="w-full h-screen p-10 bg-[#F2E9E9] overflow-auto">
                <div className="ml-64 flex flex-col gap-1">
                    <div className="flex justify-between items-center m-5">
                        <h1 className="font-bold text-2xl">Previews</h1>
                        <ScreenCreate onScreenCreated={refreshScreens} />
                    </div>
                    <DashboardStats />
                    <div className="flex justify-between px-5">
                        <ScreenPreview screenRefreshTrigger={screenRefreshTrigger} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPreviews;
