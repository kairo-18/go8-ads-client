import React, { useEffect, useState, useContext } from "react";
import logo from "/src/assets/sidebar/logo.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";


function SideBar() {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext); 

    return (
        <div className="w-64 h-full py-4 absolute font-[Inter] font-light bg-[#EEEEEE] flex flex-col justify-between">
            <a href="/">
                <img src={logo} alt="logo" className="w-32 mx-auto my-15 hover:shadow-lg rounded-xl hover:border-[#D9D9D9]" />
            </a>
            <div className="flex flex-col justify-between h-full ">
                <div className="">
                    <ul>
                        {["Dashboard", "Previews", "Ad Setting", "Scheduling", "Announcement"].map(
                            (text) => (
                                <li key={text} className="p-0">
                                    <button
                                        className="p-5 border border-transparent hover:border-[#D9D9D9] hover:bg-[#F2E9E9] w-full text-left rounded-lg hover:shadow-lg"
                                        onClick={() =>
                                            navigate(
                                                `/admin/${text
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`
                                            )
                                        }
                                    >
                                        {text}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                
            </div>
            <button className="p-5 border border-transparent hover:border-[#D9D9D9] hover:bg-[#C90000] hover:text-[#F2E9E9] w-full text-left rounded-lg hover:shadow-lg" 
             onClick={() => {
                logout();  // Call logout function
                navigate("/admin");  // Redirect to login page
            }}>
                Logout
            </button>
        </div>
    );
}

export default SideBar;
