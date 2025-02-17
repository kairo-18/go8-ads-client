import React from "react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../src/axios/axiosInstance";
import Res1 from "../Res1/Res1";
import Res2 from "../Res2/Res2";
import Res3 from "../Res3/Res3";
import { useNavigate } from "react-router-dom";

function ScreenPreview() {
    const [data, setData] = React.useState({
        screens: [],
        ads: [],
        displayedAds: 0,
    });
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axiosInstance.get(
                    "http://localhost:3000/screens"
                );

                // Extract ads from screens since there's no direct GET /ads route
                const allAds = screensResponse.data.flatMap(
                    (screen) => screen.ads || []
                );

                setData({
                    screens: screensResponse.data,
                    ads: allAds,
                    displayedAds: allAds.reduce(
                        (acc, ad) => acc + (ad.displayCount || 0),
                        0
                    ),
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []); // Add data as a dependency

    return (
        <div className="w-full h-[85vh] overflow-y-scroll border-1 rounded-2xl p-5 mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 ">
                {data.screens.map((screen, index) => {
                    return (
                        <div
                            key={index}
                            className="w-full border rounded-lg p-2 bg-[#f9f6f5] shadow-md flex flex-col justify-center items-center overflow-hidden h-70 "
                        >
                            <div
                                className="relative h-full flex justify-center items-center"
                                style={{
                                    transform: "scale(0.25) scale(1)",
                                    transformOrigin: "center",
                                }}
                            >
                                {screen.layoutType === "Res1" ? (
                                    <Res1 screenId={screen.id} />
                                ) : screen.layoutType === "Res2" ? (
                                    <Res2 screenId={screen.id} />
                                ) : screen.layoutType === "Res3" ? (
                                    <Res3 screenId={screen.id} />
                                ) : null}
                            </div>
                            <button
                                className="-mt-5 text-center text-blue-500 underline"
                                onClick={() => navigate(`/${screen.routeName}`)}
                            >
                                {screen.name}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ScreenPreview;