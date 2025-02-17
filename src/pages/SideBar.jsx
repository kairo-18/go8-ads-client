import React from "react";
import logo from "/src/assets/sidebar/logo.png";
import { useNavigate } from "react-router-dom";

function SideBar() {
    const navigate = useNavigate();
    return (
        <div className="w-64 h-full p-4 absolute font-[Inter] font-light bg-white">
            <img src={logo} alt="logo" className="w-32 mx-auto my-15" />
            <div className="flex flex-col justify-between">
                <ul>
                    {["Dashboard", "Previews", "Ad Setting", "Scheduling"].map(
                        (text) => (
                            <li key={text} className="p-0">
                                <button
                                    className="p-5 hover:bg-gray-200 w-full text-left"
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
                <hr className="my-5" />
                <button className="p-5 hover:bg-gray-200 text-left">
                    L ogout
                </button>
            </div>
        </div>
    );
}

export default SideBar;
