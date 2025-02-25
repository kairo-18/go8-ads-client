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
        setLoading(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await Promise.all(

                selectedScreens.map(screenId => axiosInstance.delete(`api/screens/${screenId}`))

            );
            refreshScreens();
            setIsDeleting(false);
            setSelectedScreens([]);
        } catch (error) {
            console.error("Error deleting screens:", error);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-white">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-10 bg-white overflow-auto transition-all duration-300">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center p-5">
                    <h1 className="font-bold text-2xl mb-1">Previews</h1> {/* Reduced margin-bottom */}
                    <hr className="border-t-2 border-gray-400 w-full mx-5" />
                        <ScreenCreate onScreenCreated={refreshScreens} />
                        <ScreenDelete
                                onConfirmDelete={handleConfirmDelete}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}
                                setSelectedScreens={setSelectedScreens}
                            />
                    </div>
          
                    <div className="flex justify-between px-5">
                        <ScreenPreview screenRefreshTrigger={screenRefreshTrigger}
                        isDeleting={isDeleting}
                        selectedScreens={selectedScreens}
                        setSelectedScreens={setSelectedScreens} />
                    </div>
                </div>
            </div>
    );
}

export default AdminPreviews;
