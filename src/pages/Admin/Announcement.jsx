import React, { useState, useEffect } from "react";
import CreateAnnouncement from "../../components/Announcement/CreateAnnouncement";
import Loading from "../../components/loading/Loading";

function Announcement() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-gray-50">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-10 bg-gray-50">
            <div className="flex flex-col gap-1">
                <h1 className="font-bold text-2xl">Announcement</h1>
                <CreateAnnouncement />
            </div>
        </div>
    );
}

export default Announcement;
