import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/src/assets/sidebar/logo.png";
import { UserContext } from "../context/UserContext";
import { menuItems } from "../constants/menuItems";
import logoutIcon from "/src/assets/icons/Open Pane.png";
import logoCollapse from "/src/assets/icons/Transparent logo 1.png";

function SideBar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation(); // Get current path
    const { logout } = useContext(UserContext);

    // Function to randomly pick a color (red, blue, yellow)
    const getRandomColor = () => {
        const colors = ["border-red-500", "border-blue-500", "border-yellow-500"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest(".sidebar")) {
                setCollapsed(true);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setCollapsed]);

    return (
        <div className={`sidebar h-full py-4 absolute font-[Inter] font-light bg-[#EEEEEE] flex flex-col justify-between transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
            {/* Logo */}
            <button onClick={() => setCollapsed(!collapsed)} className="mx-auto mb-4">
                <img src={collapsed ? logoCollapse : logo} alt="logo" className={`mx-auto hover:shadow-lg rounded-xl hover:border-[#D9D9D9] ${collapsed ? "w-8" : "w-32"}`} />
            </button>

            {/* Menu */}
            <div className="flex flex-col justify-between h-full">
                <ul>
                    {menuItems.map(({ name, path, icon }) => {
                        const isActive = location.pathname === path; // Check if current path matches menu item
                        const activeBorder = isActive ? getRandomColor() : "border-transparent";

                        return (
                            <li key={name} className="p-0">
                                <button
                                    className={`p-5 w-full text-left rounded-lg hover:shadow-lg flex items-center gap-2 transition-all duration-300 border-l-4 ${activeBorder} 
                                    ${collapsed ? "justify-center" : ""} 
                                    hover:bg-[#F2E9E9]`}
                                    onClick={() => navigate(path)}
                                >
                                    <img src={icon} alt={name} className="w-5 h-5" />
                                    {!collapsed && name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Logout Button */}
            <button
                className={`p-5 border border-transparent hover:border-[#D9D9D9] hover:bg-[#C90000] hover:text-[#F2E9E9] w-full text-left rounded-lg hover:shadow-lg flex items-center transition-all duration-300 
                ${collapsed ? "justify-center" : "gap-2"}`}
                onClick={() => {
                    logout();
                    navigate("/");
                }}
            >
                <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    );
}

export default SideBar;
