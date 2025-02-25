import React, { useState, useEffect } from "react";
import ScreenPreview from "../../components/Admin/ScreenPreview";
import DashboardStats from "../../components/Admin/DashboardStats";
import Loading from "../../components/loading/Loading"; // Ensure the correct path

function AdminPanel() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating an API call or data fetching delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-white">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-10 bg-white transition-all duration-300">
            <div className="flex flex-col gap-1">
                <div className="flex items-center p-5 gap-4"> 
                    <h1 className="font-bold text-2xl whitespace-nowrap">Dashboard</h1>
                    <hr className="border-t-2 border-gray-400 flex-grow" />
                </div>
                <DashboardStats />
               
            </div>
        </div>
    );
}

export default AdminPanel;
