import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`w-full h-screen overflow-auto p-10 bg-white transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
