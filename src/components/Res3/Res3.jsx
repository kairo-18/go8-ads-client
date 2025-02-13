import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import axios from "axios";

function Res3() {
    const [isAds, toggleAds] = useState(false);
    const [ads, setAds] = useState([]);
    
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get("http://localhost:3000/screens");
                const screen = response.data.find(screen => screen.layoutType === "Res3");
                setAds(screen ? screen.ads.slice(0, 2) : []); // Ensure only two ads
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            toggleAds((prev) => !prev);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Ad Section */}
                <AnimatePresence>
                    {isAds && ads[0] && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.5 }}
                            className="w-1/4 bg-black flex items-center justify-center"
                        >
                            {ads[0].mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                                <img className="w-full h-full object-cover" src={ads[0].mediaUrl} alt="Ad" />
                            ) : ads[0].mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                                <video className="w-full h-full object-cover" src={ads[0].mediaUrl} autoPlay loop muted />
                            ) : (
                                <p className="text-white">No valid ads available</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Flight Detail Board */}
                <div className="flex-1">
                    <FlightBoard />
                </div>
            </div>

            {/* Bottom Ad Section */}
            <AnimatePresence>
                {isAds && ads[1] && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-1/4 bg-black flex items-center justify-center"
                    >
                        {ads[1].mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                            <img className="w-full h-full object-cover" src={ads[1].mediaUrl} alt="Ad" />
                        ) : ads[1].mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                            <video className="w-full h-full object-cover" src={ads[1].mediaUrl} autoPlay loop muted />
                        ) : (
                            <p className="text-white">No valid ads available</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Res3;
