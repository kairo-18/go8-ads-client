import React from "react";
import CreateAnnouncement from "../../components/Announcement/CreateAnnouncement";

function Announcement() {
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
