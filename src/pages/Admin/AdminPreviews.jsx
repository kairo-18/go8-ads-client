import React, { useState, useEffect } from "react";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import DashboardStats from "../../components/Admin/DashboardStats";
import ScreenCreate from "../../components/Admin/ScreenCreate";
import ScreenDelete from "../../components/Admin/ScreenDelete";
import axiosInstance from "../../../src/axios/axiosInstance";
import Loading from "../../components/loading/Loading"; // Ensure the correct path

function AdminPreviews() {
    const [screenRefreshTrigger, setScreenRefreshTrigger] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedScreens, setSelectedScreens] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const refreshScreens = () => {
        setLoading(true);
        setScreenRefreshTrigger((prev) => !prev);
    };

    const handleConfirmDelete = async () => {
        try {
            await Promise.all(
                selectedScreens.map(screenId => axiosInstance.delete(`http://localhost:3000/screens/${screenId}`))
            );
            refreshScreens();
            setIsDeleting(false);
            setSelectedScreens([]);
        } catch (error) {
            console.error("Error deleting screens:", error);
        }
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="w-full h-screen p-10 bg-white overflow-auto">
                <div className="ml-64 flex flex-col gap-1 ">
                    <div className="flex justify-between items-start p-5">
                        <h1 className="font-bold text-2xl pb-5">Previews</h1>
                        <ScreenCreate onScreenCreated={refreshScreens} />
                        <ScreenDelete
                                onConfirmDelete={handleConfirmDelete}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}
                                setSelectedScreens={setSelectedScreens}
                            />
                    </div>
                    <DashboardStats />
                    <div className="flex justify-between px-5">
                        <ScreenPreview screenRefreshTrigger={screenRefreshTrigger}
                        isDeleting={isDeleting}
                        selectedScreens={selectedScreens}
                        setSelectedScreens={setSelectedScreens} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPreviews;
